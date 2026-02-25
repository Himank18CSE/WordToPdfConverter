import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/convertfile", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(".docx", ".pdf");
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (error) {
      alert("Error converting file");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>📄 Word to PDF Converter</h1>
      <p>Upload your .docx file and convert instantly</p>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".docx"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">
          {loading ? "Converting..." : "Convert to PDF"}
        </button>
      </form>
    </div>
  );
}

export default App;