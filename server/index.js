const express = require('express');
const app = express();
const multer = require("multer");
const docxToPdf = require("docx-pdf");
const path = require("path");
const fs = require("fs");
const cors= require("cors")

// Create uploads folder if not exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
app.use(cors());

const upload = multer({ storage: storage });

// Convert Route
app.post('/convertfile', upload.single('file'), (req, res) => {
  // console.log(req.file);
  // res.send("Check console");
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No File Uploaded",
      });
    }

    const outputPath = path.join(
      __dirname,
      "uploads",
      `${path.parse(req.file.originalname).name}.pdf`
    );

    docxToPdf(req.file.path, outputPath, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Error converting docx to pdf",
        });
      }

      res.download(outputPath, () => {
        console.log("Conversion successful:", result);
      });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${port}`);
});