import React, { useState } from "react";
import "./uploadVideo.css";

function UploadVideo({ onUpload, token, user, changeTab }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [filename, setFilename] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Translation & Smart Summary states
  const [translatedTranscript, setTranslatedTranscript] = useState("");
  const [translatedDiarization, setTranslatedDiarization] = useState([]);
  const [viewMode, setViewMode] = useState("original"); // "original" or "translated"
  const [translating, setTranslating] = useState(false);
  const [targetLang, setTargetLang] = useState("");
  const [summary, setSummary] = useState("");
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summaryErrorMsg, setSummaryErrorMsg] = useState("");

  // Sync Video/Audio Player & Diarization
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [parsedDiarization, setParsedDiarization] = useState([]);
  
  // Ref for audio element
  const mediaRef = React.useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setErrorMsg("");
    setSuccessMsg("");
    setTranscript("");
    setTranslatedTranscript("");
    setViewMode("original");
    setSummary("");
    setSummaryErrorMsg("");
    setParsedDiarization([]);
    setCurrentTime(0);
    setAudioDuration(0);

    if (selectedFile) {
      const validTypes = ["audio/mpeg", "audio/wav", "video/mp4", "audio/mp4", "video/webm", "audio/webm", "audio/x-m4a"];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(mp3|wav|mp4|m4a|webm)$/i)) {
        setErrorMsg("Please upload a valid audio or video file (.mp3, .wav, .mp4).");
        return;
      }
      if (selectedFile.size > 25 * 1024 * 1024) {
        setErrorMsg("File size must be less than 25MB.");
        return;
      }

      setFile(selectedFile);
      setFilename(selectedFile.name);
      const url = URL.createObjectURL(selectedFile);
      setPreview({
          url: url,
          isVideo: selectedFile.type.startsWith("video/") || selectedFile.name.endsWith(".mp4")
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg("Please select a file first!");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setTranscript("");
    setTranslatedTranscript("");
    setTranslatedDiarization([]);
    setViewMode("original");
    setSummary("");
    setSummaryErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload and processing failed");
      }

      if (data.transcript) {
        setTranscript(data.transcript);
        setSuccessMsg("Transcript generated successfully!");
        
        // Populate Advanced API Data or Fallback Array
        if (data.structuredData) {
            // Ensure data has idx mappings for keys
            const mappedData = data.structuredData.map((d, i) => ({ ...d, idx: i }));
            setParsedDiarization(mappedData);
        }
      }
      if (onUpload) onUpload(data);
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // True Calculation Cycle
  React.useEffect(() => {
      if (audioDuration > 0 && parsedDiarization.length > 0) {
          // If the backend used fallback logic, timestamps remain 0.
          // We detect this and mathematically distribute tokens simulating true time limits.
          const firstBlock = parsedDiarization[0].words;
          if (firstBlock && firstBlock.length > 0 && firstBlock[0].end === 0) {
              
             let updatedBlocks = [...parsedDiarization];
             let totalWords = 0;
             updatedBlocks.forEach(b => totalWords += b.words.length);
             
             if(totalWords > 0) {
                 const timePerWord = audioDuration / totalWords;
                 let globalTime = 0;
                 
                 for (let i = 0; i < updatedBlocks.length; i++) {
                    let blockWords = [];
                    for (let j = 0; j < updatedBlocks[i].words.length; j++) {
                        let w = updatedBlocks[i].words[j];
                        blockWords.push({
                            text: typeof w === 'string' ? w : w.text,
                            start: globalTime,
                            end: globalTime + timePerWord
                        });
                        globalTime += timePerWord;
                    }
                    updatedBlocks[i].words = blockWords;
                 }
                 setParsedDiarization(updatedBlocks);
             }
          }
      }
  }, [audioDuration, parsedDiarization]);
  
  // Intelligent Auto-Scrolling Logic bounding active speech
  React.useEffect(() => {
     const activeSpan = document.querySelector('.sync-word.active-sync');
     if (activeSpan) {
         activeSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
     }
  }, [currentTime]);

  const handleTimeUpdate = (e) => {
     if (!audioDuration || audioDuration === 0) {
         setAudioDuration(e.target.duration);
     }
     setCurrentTime(e.target.currentTime);
  };

  const handleTranslate = async (lang) => {
    if (!transcript) return;
    setTargetLang(lang);
    setTranslating(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    console.log(`[handleTranslate] Initiating translation... Target: ${lang}, Text Length: ${transcript.length}`);
    
    // Package blocks to maintain speaker structural integrity
    const blockTexts = parsedDiarization.map(b => b.words.map(w => typeof w === 'string' ? w : w.text).join(' '));
    
    try {
        const response = await fetch("http://localhost:8080/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                text: transcript, 
                targetLanguage: lang,
                blocks: blockTexts.length > 0 ? blockTexts : null
            })
        });
        
        console.log(`[handleTranslate] Response status: ${response.status}`);
        const data = await response.json();
        console.log(`[handleTranslate] Response data received:`, data);
        
        if (!response.ok) {
            throw new Error(data.error || "Translation failed");
        }
        
        setTranslatedTranscript(data.translatedText);
        
        // Directly map the translated array onto the structured blocks, preserving speakers & time bounds
        if (data.translatedBlocks && parsedDiarization.length > 0 && data.translatedBlocks.length === parsedDiarization.length) {
            const mappedTranslation = parsedDiarization.map((block, idx) => {
                const startTime = block.words.length > 0 ? block.words[0].start : 0;
                const endTime = block.words.length > 0 ? block.words[block.words.length - 1].end : 0;
                return {
                    ...block,
                    words: [{ text: data.translatedBlocks[idx], start: startTime, end: endTime }]
                };
            });
            setTranslatedDiarization(mappedTranslation);
        }
        
        setViewMode("translated");
        setSuccessMsg(`Translated to ${lang === 'en' ? 'English' : 'Hindi'} successfully!`);
    } catch (error) {
        console.error("[handleTranslate] Request failed: ", error);
        setErrorMsg("Translation failed, please try again");
        setViewMode("original");
        setTranslatedTranscript("");
        setTranslatedDiarization([]);
    } finally {
        setTranslating(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!transcript) return;
    setGeneratingSummary(true);
    setSummaryErrorMsg("");
    
    console.log("[handleGenerateSummary] Initiating summary generation for text length:", transcript.length);
    
    try {
        const response = await fetch("http://localhost:8080/api/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: transcript })
        });
        
        console.log("[handleGenerateSummary] Raw response status:", response.status);
        const data = await response.json();
        console.log("Summary response:", data);
        
        if (!response.ok) {
            throw new Error(data.error || "Summary generation failed");
        }
        
        setSummary(data.summary);
    } catch (error) {
        console.error("Summary Error Details: ", error);
        setSummaryErrorMsg("Summary generation failed. Please try again.");
    } finally {
        setGeneratingSummary(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      setErrorMsg("Please login to save transcripts.");
      setTimeout(() => changeTab("Login"), 1500);
      return;
    }

    if (!transcript) return;

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    const textToSave = viewMode === "translated" ? translatedTranscript : transcript;
    const outputL = viewMode === "translated" ? targetLang : "original";

    try {
      const response = await fetch("http://localhost:8080/api/transcriptions/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          filename: filename,
          transcript: textToSave,
          inputLanguage: "auto",
          outputLanguage: outputL
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save transcript");
      }

      setSuccessMsg("Transcript saved successfully to your Past Generations!");
    } catch (error) {
      console.error("Save Error:", error);
      setErrorMsg(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    if (!user) {
      setErrorMsg("Please login to download transcripts.");
      setTimeout(() => changeTab("Login"), 1500);
      return;
    }

    if (!transcript) return;

    const textToDownload = viewMode === "translated" ? translatedTranscript : transcript;
    const blob = new Blob([textToDownload], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename || "transcript"}_${viewMode}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div className="glow-effect"></div>
        <h2 className="upload-title text-glow">Speech to Text AI</h2>
        <p className="upload-subtitle">
          Upload any audio/video up to 25MB and get instant transcriptions.
        </p>

        {errorMsg && <div className="alert-message error">{errorMsg}</div>}
        {successMsg && <div className="alert-message success">{successMsg}</div>}

        <div className="upload-box modern-drag-drop">
          <label className="upload-label d-flex flex-column align-items-center justify-content-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" fill="var(--primary-color)" className="bi bi-cloud-arrow-up mb-3 drop-icon" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
              <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
            </svg>
            <span className="fw-medium text-light-blue">Click to select file</span>
            <span className="text-muted small mt-1">or drag and drop here</span>
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        {file && (
          <div className="file-info mt-3 p-3 bg-glass rounded d-flex justify-content-between align-items-center text-dark">
            <span className="text-truncate" style={{maxWidth: "80%"}}><strong>Selected:</strong> {file.name}</span>
            <span className="badge bg-custom-glow rounded-pill">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        )}

        {preview && (
          <div className="video-preview-container mt-3 glass-border">
             {preview.isVideo ? (
                 <video 
                    ref={mediaRef}
                    src={preview.url} 
                    controls 
                    className="video-preview w-100 rounded" 
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={(e) => setAudioDuration(e.target.duration)}
                    style={{maxHeight: '250px'}}
                 />
             ) : (
                 <audio 
                    ref={mediaRef}
                    src={preview.url} 
                    controls 
                    className="w-100 mt-2" 
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={(e) => setAudioDuration(e.target.duration)}
                 />
             )}
          </div>
        )}

        <button className="btn modern-btn upload-btn w-100 mt-4 btn-primary" onClick={handleUpload} disabled={loading || !file}>
          {loading ? (
            <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing Audio...</span>
          ) : (
            "Generate Transcript"
          )}
        </button>

        {transcript && (
          <div className="transcript-result mt-4 p-4 rounded bg-glass border-glow text-start text-dark">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="h5 fw-bold mb-0" style={{color: "var(--primary-color)"}}>Generated Transcript:</h3>
            </div>
            
            {translatedTranscript && (
               <div className="d-flex gap-2 mb-3">
                  <button className={`btn btn-sm ${viewMode === 'original' ? 'btn-primary modern-btn' : 'btn-outline-primary'}`} 
                          onClick={() => setViewMode('original')}>Original
                  </button>
                  <button className={`btn btn-sm ${viewMode === 'translated' ? 'btn-primary modern-btn' : 'btn-outline-primary'}`} 
                          onClick={() => setViewMode('translated')}>Translated
                  </button>
               </div>
            )}

            <div className="transcript-box mb-3 p-3 rounded" style={{maxHeight: '400px', overflowY: 'auto', background: 'var(--bg-color)', border: '1px solid var(--border-color)'}}>
               {parsedDiarization.length > 0 ? (
                 <div className="diarization-container d-flex flex-column gap-3">
                    {(viewMode === "translated" && translatedDiarization.length > 0 ? translatedDiarization : parsedDiarization).map((block) => {
                        return (
                            <div key={`block-${block.idx}`} className="chat-bubble-wrapper d-flex flex-column align-items-start w-100 mb-2">
                               <strong className="speaker-name mb-1" style={{ 
                                   color: block.speaker === 'Speaker 1' ? '#4A90E2' : '#2ecc71',
                                   fontSize: '0.9rem',
                                   display: 'flex', alignItems: 'center', gap: '5px'
                               }}>
                                   {block.speaker === 'Speaker 1' ? '🟦' : '🟩'} {block.speaker}
                               </strong>
                               <div className="chat-bubble p-3 rounded shadow-sm text-dark" style={{
                                   background: block.speaker === 'Speaker 1' ? 'rgba(74, 144, 226, 0.05)' : 'rgba(46, 204, 113, 0.05)',
                                   lineHeight: "1.8",
                                   borderLeft: `4px solid ${block.speaker === 'Speaker 1' ? '#4A90E2' : '#2ecc71'}`,
                                   width: '100%',
                                   cursor: 'pointer'
                               }}>
                                  {block.words.map((w, widx) => {
                                      const mappedWord = typeof w === 'string' ? {text: w, start: 0, end: 0} : w;
                                      // Buffer the visual frame slightly due to HTML5 Player polling
                                      const isActive = currentTime >= mappedWord.start && currentTime <= (mappedWord.end + 0.1);
                                      return (
                                          <span 
                                              key={`w-${widx}`} 
                                              className={`sync-word px-1 rounded mx-1 ${isActive ? 'bg-primary text-white shadow-sm active-sync' : ''}`}
                                              style={{ transition: 'all 0.2s ease', display: 'inline-block' }}
                                              onClick={() => {
                                                  if(mediaRef.current) mediaRef.current.currentTime = mappedWord.start;
                                              }}
                                          >
                                              {mappedWord.text}
                                          </span>
                                      );
                                  })}
                               </div>
                            </div>
                        )
                    })}
                 </div>
               ) : (
                 <p className="mb-0" style={{lineHeight: "1.6", whiteSpace: "pre-wrap"}}>
                   {viewMode === "translated" ? translatedTranscript : transcript}
                 </p>
               )}
            </div>
            
            {!translatedTranscript && (
                <div className="d-flex gap-2 mb-4 justify-content-start" style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '16px'}}>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleTranslate('en')} disabled={translating}>
                        {translating && targetLang === 'en' ? 'Translating...' : 'Translate to English'}
                    </button>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleTranslate('hi')} disabled={translating}>
                        {translating && targetLang === 'hi' ? 'Translating...' : 'Translate to Hindi'}
                    </button>
                </div>
            )}
            {translatedTranscript && (
                 <div className="d-flex gap-2 mb-4 justify-content-start" style={{borderBottom: '1px solid var(--border-color)', paddingBottom: '16px'}}>
                    <span className="text-muted small align-self-center">Translation successful. Target: {targetLang === 'en' ? 'English' : 'Hindi'}. ({viewMode} displayed)</span>
                 </div>
            )}

            <div className="d-flex gap-3 justify-content-end action-buttons">
               <button className="btn btn-outline-light modern-btn" onClick={handleDownload} style={{background: 'var(--bg-color)'}}>
                  Download TXT
               </button>
               <button className="btn btn-primary modern-btn" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save to Profile"}
               </button>
            </div>
            {!user && <p className="text-end text-muted small mt-2">Login is required to save or download.</p>}

            {/* Smart Summary Generation */}
            <div className="mt-4 pt-3" style={{borderTop: '1px solid var(--border-color)'}}>
               <button 
                  className="btn btn-primary modern-btn" 
                  onClick={handleGenerateSummary} 
                  disabled={generatingSummary}
                  style={{borderRadius: '8px'}}
               >
                  {generatingSummary ? (
                     <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Generating Summary...</span>
                  ) : (
                     "✨ Generate Smart Summary"
                  )}
               </button>
               
               {summaryErrorMsg && <div className="alert-message error mt-3 mb-0" style={{padding: '10px'}}>{summaryErrorMsg}</div>}
               
               {summary && (
                  <div className="mt-3 p-4 rounded bg-glass border-glow text-start text-dark shadow-sm">
                     <h4 className="h6 fw-bold mb-2" style={{color: "var(--primary-color)"}}>Smart Summary</h4>
                     <div className="summary-box p-3 rounded" style={{background: 'var(--bg-color)', border: '1px solid var(--border-color)'}}>
                        <p className="mb-0" style={{lineHeight: "1.6", whiteSpace: "pre-wrap"}}>{summary}</p>
                     </div>
                  </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadVideo;
