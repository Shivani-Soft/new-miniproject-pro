import React, { useState } from "react";
import "./uploadVideo.css";

function UploadVideo({ onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      alert("Video uploaded and transcribed successfully!");
      console.log(data);
      if (data.transcript) {
        setTranscript(data.transcript);
      }
      if (onUpload) onUpload(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Audio or Video</h2>
      <p className="upload-subtitle">
        Select your audio/video file and convert it into text with one click.
      </p>

      <div className="upload-box">
        <label className="upload-label">
          Click to Select File
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileChange}
          />
        </label>

        {file && <p className="file-name">Selected: {file.name}</p>}

        {preview && (
          <video src={preview} controls className="video-preview"></video>
        )}

        <button className="upload-btn" onClick={handleUpload} disabled={loading}>
          {loading ? "Processing..." : "Upload & Convert"}
        </button>

        {transcript && (
          <div className="transcript-result">
            <h3>Transcript:</h3>
            <p>{transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadVideo;
