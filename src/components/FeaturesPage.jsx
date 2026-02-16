import React from "react";
import "./featuresPage.css";

function FeaturesPage() {
  const features = [
    {
      title: "Audio to Text Conversion",
      desc: "Upload audio files and convert them into accurately formatted text in seconds.",
      icon: "🎙️",
    },
    {
      title: "Video to Text Processing",
      desc: "Extract speech and dialogues from video files and generate readable transcripts.",
      icon: "🎥",
    },
    {
      title: "Supports Multiple Formats",
      desc: "Works smoothly with MP3, WAV, MP4, MKV and many other formats.",
      icon: "📁",
    },
    {
      title: "Save & Download Scripts",
      desc: "Store transcripts securely and download anytime as .txt or .doc file.",
      icon: "💾",
    },
    {
      title: "Secure User Authentication",
      desc: "Signup/Login to manage and access your history securely.",
      icon: "🔐",
    },
    {
      title: "Fast & Accurate Output",
      desc: "Powered by AI-based models for quick and high-quality text conversion.",
      icon: "⚡",
    },
  ];

  return (
    <div className="features-container">
      <h2 className="features-title">Our Key Features</h2>
      <p className="features-subtitle">
        Explore what makes our Audio & Video to Text Generator powerful and
        user-friendly.
      </p>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturesPage;
