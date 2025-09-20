import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [pdfName, setPdfName] = useState("");

  const generateContent = async () => {
    const res = await fetch("/api/generate-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });
    const data = await res.json();
    setContent(data.content);
    setTitle(topic);
    setPdfName(topic.replace(/\s+/g, "_").toLowerCase());
  };

  const generatePDF = async () => {
    const res = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, pdfName }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pdfName || "document"}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "auto" }}>
      <h1>ChatGPT → PDF Generator</h1>

      <input
        style={{ width: "100%", margin: "8px 0", padding: "8px" }}
        placeholder="Enter a topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button onClick={generateContent} style={{ marginBottom: 20 }}>
        Generate Content
      </button>

      <textarea
        style={{ width: "100%", height: 150, margin: "8px 0", padding: "8px" }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={generatePDF} style={{ marginTop: 10 }}>
        Download as PDF
      </button>
    </div>
  );
}
