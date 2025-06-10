import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://serenity-chatbot-88oz.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

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
          'HTTP-Referer': 'https://serenity-chatbot-88oz.vercel.app',
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