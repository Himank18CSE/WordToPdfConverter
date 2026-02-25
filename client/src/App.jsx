import React, { useState } from "react";
import { motion } from "framer-motion";
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
    <div className="main">
      <motion.div
        className="card"
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          📄 Word to PDF Converter
        </motion.h1>

        <p>Upload your .docx file and convert instantly</p>

        <form onSubmit={handleSubmit}>
          <motion.input
            type="file"
            accept=".docx"
            whileHover={{ scale: 1.05 }}
            onChange={(e) => setFile(e.target.files[0])}
          />

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
          >
            {loading ? "Converting..." : "Convert to PDF"}
          </motion.button>
        </form>

        {loading && (
          <motion.div
            className="loader"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            🔄
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default App;