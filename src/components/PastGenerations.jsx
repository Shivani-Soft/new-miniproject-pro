import React, { useState, useEffect } from "react";
import "./pastGenerations.css";

function PastGenerations() {
    const [transcriptions, setTranscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTranscriptions();
    }, []);

    const fetchTranscriptions = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/transcriptions");
            if (!response.ok) {
                throw new Error("Failed to fetch transcriptions");
            }
            const data = await response.json();
            setTranscriptions(data.transcriptions);
        } catch (err) {
            console.error("Error fetching transcriptions:", err);
            setError("Failed to load past generations.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Past Generations</h2>
            {transcriptions.length === 0 ? (
                <p>No transcriptions found.</p>
            ) : (
                <div className="list-group">
                    {transcriptions.map((item) => (
                        <div key={item.id} className="list-group-item list-group-item-action flex-column align-items-start bg-dark text-white border-secondary mb-2">
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">{item.filename}</h5>
                                <small className="text-muted">{new Date(item.created_at).toLocaleString()}</small>
                            </div>
                            <p className="mb-1" style={{ whiteSpace: "pre-wrap" }}>{item.transcript}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PastGenerations;
