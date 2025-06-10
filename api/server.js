// ... existing code ...
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();

// Update CORS settings to allow your GitHub Pages frontend
app.use(cors({
  origin: "https://aarmaan-choudhary.github.io",  // replace with your actual GitHub Pages URL
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json());

// ... existing code ...

// ... existing code ...



// Add this route to confirm backend is live
app.get("/", (req, res) => {
  res.send("Serenity backend is live!");
});

// ... existing code ...

app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`, // <-- Replace with your OpenRouter key
          'HTTP-Referer': 'https://aarmaan-choudhary.github.io', // <-- Your frontend URL
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