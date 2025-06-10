import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Update CORS settings to allow your Vercel frontend
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://serenity-chatbot-88oz.vercel.app',
      'https://serenity-chatbot-88oz.vercel.app/',
      'http://localhost:5173'  // For local development
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());

// Add this route to confirm backend is live
app.get("/", (req, res) => {
  res.send("Serenity backend is live!");
});

app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.FRONTEND_URL || "https://serenity-chatbot-88oz.vercel.app",
          'X-Title': 'Mindful Chat App'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error('OpenRouter API error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: err.toString(), details: err.response ? err.response.data : undefined });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));