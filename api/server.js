import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';

dotenv.config();

const app = express();
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// CORS configuration
const corsOptions = {
  origin: 'https://serenity-chatbot-88oz.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Additional headers middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://serenity-chatbot-88oz.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());

// Add this route to confirm backend is live
app.get("/", (req, res) => {
  res.send("Serenity backend is live!");
});

// Add new endpoint for sentiment analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    
    // Get sentiment analysis
    const sentimentResult = await hf.textClassification({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: text
    });

    // Get emotion analysis
    const emotionResult = await hf.textClassification({
      model: 'j-hartmann/emotion-english-distilroberta-base',
      inputs: text
    });

    res.json({
      sentiment: sentimentResult,
      emotion: emotionResult
    });
  } catch (err) {
    console.error('Hugging Face API error:', err);
    res.status(500).json({ error: err.toString() });
  }
});

// Modify the chat endpoint to include analysis
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const lastUserMessage = messages[messages.length - 1].content;

    // Get sentiment and emotion analysis
    const sentimentResult = await hf.textClassification({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: lastUserMessage
    });

    const emotionResult = await hf.textClassification({
      model: 'j-hartmann/emotion-english-distilroberta-base',
      inputs: lastUserMessage
    });

    // Add analysis context to the system message
    const systemMessage = {
      role: 'system',
      content: `The user's message shows ${sentimentResult[0].label} sentiment and ${emotionResult[0].label} emotion. 
      Please respond appropriately with empathy and understanding, considering their emotional state.`
    };

    // Add the system message to the beginning of the messages array
    const enhancedMessages = [systemMessage, ...messages];

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      { ...req.body, messages: enhancedMessages },
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
    console.error('API error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: err.toString(), details: err.response ? err.response.data : undefined });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));