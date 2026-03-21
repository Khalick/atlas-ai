const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// In-memory mock DB
const videos = [];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static(uploadDir));

app.get('/api/videos', (req, res) => {
    res.json(videos);
});

app.post('/api/videos', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No video uploaded' });
    }

    const { title, payout } = req.body;
    let segments = 5;
    const payoutNum = parseFloat(payout);

    if (payoutNum === 0.7) segments = 10;
    else if (payoutNum === 0.4) segments = 20;
    else if (payoutNum === 0.3) segments = 9;
    
    const newVideo = {
        id: Date.now().toString(),
        filename: req.file.filename,
        title: title || 'Untitled Video',
        payout: payoutNum || 0.3,
        segments: segments,
        url: `http://localhost:3001/uploads/${req.file.filename}`,
        uploadedAt: new Date().toISOString()
    };

    videos.push(newVideo);
    res.status(201).json(newVideo);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
