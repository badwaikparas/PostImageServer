const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const FormData = require('form-data');

dotenv.config();

const app = express();
app.use(express.json());

app.post('/upload', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default; // Dynamic import for CommonJS
        const formData = new FormData();
        formData.append("source", fs.createReadStream("./monitor1.png"));

        const response = await fetch("https://postimage.me/api/1/upload", {
            method: "POST",
            headers: {
                "X-API-Key": process.env.POSTIMAGE_API_KEY
            },
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log("Upload successful:", result);
        res.json({
            img_url: result.image.url,
            img_delete_url: result.image.delete_url,
            img_viwer_url: result.image.url_viewer
        });
    } catch (error) {
        console.error("Upload failed:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
