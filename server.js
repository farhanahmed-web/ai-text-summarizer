require('dotenv').config(); 
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize the Google Generative AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_BACKUP_KEY_HERE");

// Middleware configuration
app.use(express.json());
app.use(express.static('public')); 

// 🤖 The AI Summarizer Endpoint
app.post('/api/summarize', async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Please provide text to summarize." });
        }

        // Fetch standard stable generation model
        const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

        const prompt = `
            Analyze the following text. 
            Provide a concise summary strictly formatted as exactly 3 bullet points.
            Then, translate those 3 bullet points directly into ${targetLanguage || 'English'}.
            
            Text to process:
            "${text}"
        `;

        // ⚡ FIX: Use pure string arguments for standard text inputs
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResponseText = response.text();

        res.json({ summary: aiResponseText });

    } catch (error) {
        console.error("⛔ DETAILED AI ROUTE ERROR:", error); 
        res.status(500).json({ error: error.message || "AI Processing failure." });
    }
});

// Boot up the server
app.listen(PORT, () => {
    console.log(`🚀 Quantum leap server active on port ${PORT}`);
});
