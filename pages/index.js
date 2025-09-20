import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [instructions, setInstructions] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [password, setPassword] = useState("");

  const generateContent = async () => {
    const res = await fetch("/api/generate-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, keywords, instructions, password }),
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
      return;
    }
    setContent(data.content);
    if (!title) setTitle(topic);
    if (!pdfName) setPdfName(topic.replace(/\s+/g, "_").toLowerCase());
  };

  const generatePDF = async () => {
    const res = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, pdfName, password }),
    });

    if (res.status === 401) {
      alert("Unauthorized: Wrong password");
      return;
    }

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
      <h1>ChatGPT → PDF Generator (Secure)</h1>

      <input
        type="password"
        style={{ width: "100%", margin: "8px 0", padding: "8px" }}
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        style={{ width: "100%", margin: "8px 0", padding: "8px" }}
        placeholder="Enter a topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <input
        style={{ width: "100%", margin: "8px 0", padding: "8px" }}
        placeholder="Keywords (comma separated)"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />

      <textarea
        style={{ width: "100%", height: 100, margin: "8px 0", padding: "8px" }}
        placeholder="Additional instructions (e.g. include FAQ, use headings, formal tone)"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
      />

      <button onClick={generateContent} style={{ marginBottom: 20 }}>
        Generate Content
      </button>

      <input
        style={{ width: "100%", margin: "8px 0", padding: "8px" }}
        placeholder="Custom Title for PDF"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        style={{ width: "100%", margin: "8px 0", padding: "8px" }}
        placeholder="PDF File Name (without .pdf)"
        value={pdfName}
        onChange={(e) => setPdfName(e.target.value)}
      />

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