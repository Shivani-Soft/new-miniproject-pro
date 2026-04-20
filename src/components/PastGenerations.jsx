import React, { useState, useEffect } from "react";
import "./pastGenerations.css";

function PastGenerations({ token, searchTerm }) {
    const [transcriptions, setTranscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTranscriptions();
    }, []);

    const fetchTranscriptions = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/transcriptions", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch transcriptions");
            }
            const data = await response.json();
            setTranscriptions(data.transcriptions);
        } catch (err) {
            console.error("Error fetching transcriptions:", err);
            setError("Failed to load past generations. Please ensure you are logged in.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
       <div className="d-flex justify-content-center align-items-center" style={{minHeight: '60vh'}}>
           <div className="spinner-border text-primary" role="status">
             <span className="visually-hidden">Loading...</span>
           </div>
       </div>
    );
    
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

    const filteredTranscriptions = transcriptions.filter(item => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (item.filename && item.filename.toLowerCase().includes(term)) ||
               (item.transcript && item.transcript.toLowerCase().includes(term));
    });

    return (
        <div className="pg-container">
            <h2 className="pg-title text-glow mb-2">Past Generations</h2>
            <p className="pg-subtitle mb-4">View your saved transcriptions and text translations.</p>
            
            {transcriptions.length === 0 ? (
                <div className="empty-state">No transcriptions found. Start uploading!</div>
            ) : filteredTranscriptions.length === 0 ? (
                <div className="empty-state">No matching transcripts found for "{searchTerm}".</div>
            ) : (
                <div className="list-group">
                    {filteredTranscriptions.map((item) => (
                        <div key={item.id} className="pg-item bg-glass border-glow mb-3 rounded">
                            <div className="d-flex w-100 justify-content-between mb-2 pb-2" style={{borderBottom: '1px solid var(--border-color)'}}>
                                <h5 className="mb-0 text-dark">{item.filename}</h5>
                                <small className="text-muted">{new Date(item.created_at).toLocaleString()}</small>
                            </div>
                            <div className="d-flex gap-2 mb-3">
                                <span className="badge bg-custom-glow rounded-pill">{item.input_language || 'Auto'} ➔ {item.output_language || 'en'}</span>
                            </div>
                            <div className="transcript-box shadow-sm">
                                <p className="mb-0 text-dark" style={{ whiteSpace: "pre-wrap" }}>{item.transcript}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PastGenerations;
