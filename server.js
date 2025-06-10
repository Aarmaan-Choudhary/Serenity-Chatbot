import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`, // <-- Replace with your OpenRouter key
          'HTTP-Referer': 'http://localhost:5173', // <-- Your frontend URL
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

app.listen(3001, () => console.log('Server running on port 3001')); 