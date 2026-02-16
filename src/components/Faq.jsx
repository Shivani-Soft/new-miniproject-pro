import React, { useState } from "react";
import "./faq.css";

function Faq() {
  const faqList = [
    {
      question: "What does this Audio/Video to Text Generator do?",
      answer:
        "It converts your audio or video files into accurate and readable text using AI-powered speech recognition.",
    },
    {
      question: "Which file formats are supported?",
      answer:
        "MP3, WAV, MP4, MKV, MOV, and several other commonly used formats are supported.",
    },
    {
      question: "Is the service free to use?",
      answer:
        "Yes, the basic version is free. You can upload files and generate transcripts without any charges.",
    },
    {
      question: "Can I save or download my generated transcripts?",
      answer:
        "Yes, you can save them to your account and download them anytime as .txt or .doc files.",
    },
    {
      question: "Is my uploaded data secure?",
      answer:
        "Absolutely. All your files are encrypted and securely stored. Only you can access your transcripts.",
    },
    {
      question: "Do I need an account to use the tool?",
      answer:
        "You need to create an account to save history, but you can also test conversion without logging in.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      <p className="faq-subtitle">
        Find answers to the most common questions about our platform.
      </p>

      <div className="faq-list">
        {faqList.map((faq, index) => (
          <div className="faq-item" key={index}>
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <span>{faq.question}</span>
              <span className="faq-toggle">
                {openIndex === index ? "−" : "+"}
              </span>
            </div>

            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Faq;
