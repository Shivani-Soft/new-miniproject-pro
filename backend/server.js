const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const db = require('./database');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Routes

// Upload and Transcribe Route
app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;

    try {
        // 1. Call ElevenLabs API
        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'ElevenLabs API key not configured' });
        }

        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        // I will use a generic implementation and if it fails I'll debug.
        // Common Endpoint: https://api.elevenlabs.io/v1/speech-to-text
        // Required fields: file, model_id.

        formData.append('model_id', 'scribe_v1');

        const response = await axios.post('https://api.elevenlabs.io/v1/speech-to-text', formData, {
            headers: {
                ...formData.getHeaders(),
                'xi-api-key': apiKey
            }
        });

        const transcriptText = response.data.text;

        // 2. Save to Database
        db.run(`INSERT INTO transcriptions (filename, transcript) VALUES (?, ?)`,
            [req.file.originalname, transcriptText],
            function (err) {
                if (err) {
                    console.error('DB Error:', err.message);
                    // Still return the transcript even if DB save fails, but log it.
                }

                // 3. Return Result
                res.json({
                    message: 'File processed successfully',
                    transcript: transcriptText,
                    id: this.lastID
                });
            }
        );

    } catch (error) {
        console.error('Error processing file:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to transcribe file', details: error.message });
    } finally {
        // Optional: Delete file after processing to save space
        // fs.unlinkSync(filePath); 
    }
});

// Get Transcriptions Route
app.get('/api/transcriptions', (req, res) => {
    db.all("SELECT * FROM transcriptions ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ transcriptions: rows });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
