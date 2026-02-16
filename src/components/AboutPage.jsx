import React from "react";
import "./aboutPage.css";

function AboutPage() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h2>About Our Project</h2>
        <p>
          A smart and efficient tool to convert audio and video content into
          accurate, readable text.
        </p>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h3>🎯 Our Mission</h3>
          <p>
            Our goal is to make media content more accessible by transforming
            speech and dialogues into easy-to-read transcripts. Whether it’s
            lectures, meetings, podcasts, or videos—our system helps you convert
            everything into text effortlessly.
          </p>
        </div>

        <div className="about-section">
          <h3>💡 What We Offer</h3>
          <ul>
            <li>Fast and accurate audio-to-text conversion</li>
            <li>Video speech extraction and transcription</li>
            <li>User-friendly dashboard and file management</li>
            <li>Secure login and personalized account access</li>
            <li>History of saved transcripts anytime</li>
          </ul>
        </div>

        <div className="about-section">
          <h3>🚀 Why We Built This</h3>
          <p>
            In todays fast-paced world, consuming long audio or video content
            can be time-consuming. Our solution helps students, professionals,
            creators, and researchers quickly extract text so they can focus on
            what matters most.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
