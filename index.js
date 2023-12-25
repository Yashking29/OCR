// server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');
const { performActionOnFile } = require('./vision.js');

const app = express();
const port = 3001;

app.use(cors());

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFileName); // Use a unique filename
    req.uploadedFileName = uniqueFileName; // Store the filename for later use
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  // File is uploaded and can be accessed via req.file
  console.log('File uploaded:', req.uploadedFileName);

  // Rename the uploaded file to a specific name
  const uploadedFilePath = path.join(__dirname, 'uploads', req.uploadedFileName);
  const newFileName = 'j1.jpg'; // Replace with your desired name
  const newFilePath = path.join(__dirname, 'uploads', newFileName);

  try {
    await fs.rename(uploadedFilePath, newFilePath);
    console.log('File renamed to:', newFileName);
    
  } catch (error) {
    console.error('Error renaming file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  const file='./uploads/j1.jpg'
  const actionResult = await performActionOnFile(file);
  
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
