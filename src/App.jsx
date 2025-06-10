import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const API_URL = "http://localhost:3001/api/chat"; // Use backend proxy for OpenRouter

function App() {
  const initialMessages = [
    {
      role: "assistant",
      content:
        "Hello, I'm here to listen and support you. How are you feeling today?",
    },
  ];
  const [chats, setChats] = useState([
    { id: Date.now(), messages: initialMessages }
  ]);
  const [currentChatIdx, setCurrentChatIdx] = useState(0);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const chatEndRef = useRef(null);
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.6);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState({});
  const ASSISTANT_PREVIEW_LIMIT = 500;
  const BUBBLE_SPLIT_LIMIT = 400;
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiList = ["😀", "😊", "😢", "😎", "😡", "🥰", "👍", "🙏", "🌱", "💬", "❤️", "✨", "😌", "🤗", "😇", "😔", "😃", "😂", "😭", "😅", "😳", "😴", "🤔", "🙌", "😇", "😶"];
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (soundEnabled) {
        audioRef.current.muted = false;
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.muted = true;
        audioRef.current.play().catch(() => {});
      }
    }
  }, [volume, soundEnabled]);

  // Show scroll-to-bottom button if not at bottom
  useEffect(() => {
    const messagesDiv = document.querySelector('.messages');
    if (!messagesDiv) return;
    function handleScroll() {
      const atBottom = messagesDiv.scrollHeight - messagesDiv.scrollTop - messagesDiv.clientHeight < 40;
      setShowScrollButton(!atBottom);
    }
    messagesDiv.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => messagesDiv.removeEventListener('scroll', handleScroll);
  }, [chats, loading]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Immediately add the user message
    setChats((prevChats) => {
      const updatedChats = [...prevChats];
      const chat = { ...updatedChats[currentChatIdx] };
      chat.messages = [
        ...chat.messages,
        { role: "user", content: input.trim() },
      ];
      updatedChats[currentChatIdx] = chat;
      return updatedChats;
    });
    setInput("");
    setLoading(true);

    // Build the message array for the API (system prompt + conversation + new user message)
    const apiMessages = [
      {
        role: "system",
        content:  `
        You are Serenity — a warm, emotionally intelligent mental health chatbot.
        
        Speak like a kind, calm friend who listens deeply and responds supportively. Your tone should be gentle, conversational, and human — not robotic or clinical. Imagine texting a close, understanding friend.
        
        Keep each reply short and easy to read — 1 to 3 short sentences max. Use line breaks for flow, but no more than 2 per message. Avoid long paragraphs.
        
        💬 Place emojis naturally within the sentence where they support the emotion (not just at the end). Use 1–2 max per message. Choose soft, emotionally aware emojis that match your tone: 🌸 (gentle), 🤝 (support), 💭 (thoughts), 🍃 (calm), ☁️ (heavy feelings), 🤗 (warmth), 🧠 (mental focus), 💙 (care).
        
        Reflect the user's emotions with empathy. Acknowledge pain without trying to fix it. Ask thoughtful, open-ended follow-up questions like:
        - “Would you like to talk more about that?”
        - “What’s been on your mind lately?”
        - “Do you want to sit with that feeling together for a moment?”
        
        If someone shares something light or off-topic, respond with curiosity:
        - “That’s interesting! What made you think of that?”
        - “Love that 🦒 — what’s your favorite thing about them?”
        
        When appropriate, offer gentle support strategies:
        - “Would a short breathing exercise help? 🍃”
        - “We could try a 2-minute grounding check-in if you’d like.”
        
        Avoid any medical or diagnostic language. If someone seems to be in crisis, gently redirect them to real help:
        - “Your safety matters most. I can’t provide emergency support, but I can help you find someone who can.”
        
        Always prioritize emotional safety, trust, and warmth. Keep your language soft and human — just like someone who truly cares.
        `.trim(),
      },
      ...chats[currentChatIdx].messages,
      { role: "user", content: input.trim() },
    ];

    try {
      const response = await axios.post(
        API_URL,
        {
          model: "openai/gpt-3.5-turbo",
          messages: apiMessages,
          temperature: 0.7,
        }
      );
      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        const chat = { ...updatedChats[currentChatIdx] };
        chat.messages = [
          ...chat.messages,
          response.data.choices[0].message,
        ];
        updatedChats[currentChatIdx] = chat;
        return updatedChats;
      });
    } catch (err) {
      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        const chat = { ...updatedChats[currentChatIdx] };
        chat.messages = [
          ...chat.messages,
          {
            role: "assistant",
            content:
              "I'm sorry, I couldn't process your request right now. Please try again.",
          },
        ];
        updatedChats[currentChatIdx] = chat;
        return updatedChats;
      });
    }
    setLoading(false);
  };

  const handleShowMore = (idx) => {
    setExpandedMessages((prev) => ({ ...prev, [idx]: true }));
  };

  // Re-add auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const handleEmojiClick = (emoji) => {
    setInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleNewChat = () => {
    setChats((prev) => [
      { id: Date.now(), messages: initialMessages },
      ...prev,
    ]);
    setCurrentChatIdx(0);
    setExpandedMessages({});
  };

  const handleSelectChat = (idx) => {
    setCurrentChatIdx(idx);
    setExpandedMessages({});
  };

  const handleEnableSound = () => {
    setSoundEnabled(true);
  };

  return (
    <div className={`app-container ${theme}-theme`}>
      {/* Calming background sound with custom controls */}
      <audio
        ref={audioRef}
        src="relaxing_music.mp3"
        autoPlay
        loop
        muted={!soundEnabled}
        style={{ display: 'none' }}
      />
      {!soundEnabled && (
        <div className="enable-sound-modal-backdrop">
          <div className="enable-sound-modal">
            <button className="enable-sound-btn" onClick={handleEnableSound} aria-label="Enable background music">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: 6}}>
                <path d="M3 9v4h4l5 5V4L7 9H3z" fill="#457b9d"/>
                <path d="M16.5 8.5a4 4 0 010 5" stroke="#457b9d" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M18.5 6.5a7 7 0 010 9" stroke="#457b9d" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Enable Sound
            </button>
            <div className="enable-sound-desc">Click to enable calming background music for a more serene experience.</div>
          </div>
        </div>
      )}
      <div className="custom-audio-player vertical">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={e => setVolume(Number(e.target.value))}
          aria-label="Volume"
          className="audio-slider vertical"
          orient="vertical"
          style={{ writingMode: "bt-lr" }}
        />
        <div className="volume-icon">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M3 9v4h4l5 5V4L7 9H3z" fill="#457b9d"/>
            <path d="M16.5 8.5a4 4 0 010 5" stroke="#457b9d" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M18.5 6.5a7 7 0 010 9" stroke="#457b9d" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <div className="sidebar">
        <button className="new-chat-btn" onClick={handleNewChat} aria-label="Start a new chat">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: 8}}>
            <rect x="9" y="3" width="2" height="14" rx="1" fill="#457b9d"/>
            <rect x="3" y="9" width="14" height="2" rx="1" fill="#457b9d"/>
          </svg>
          New Chat
        </button>
        <div className="chat-list">
          {chats.map((chat, idx) => (
            <button
              key={chat.id}
              className={`chat-list-item${idx === currentChatIdx ? ' active' : ''}`}
              onClick={() => handleSelectChat(idx)}
            >
              <span className="chat-preview">
                {chat.messages[1]?.content?.slice(0, 24) || 'New chat'}
              </span>
              <span className="chat-list-date">{new Date(chat.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="chat-box">
        <div className="chat-header">
          Serenity
          <div className="theme-toggle">
            <label className="switch">
              <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} aria-label="Toggle dark mode" />
              <span className="slider"></span>
            </label>
            <span className="theme-label">{theme === 'dark' ? '🌙' : '☀️'}</span>
          </div>
        </div>
        <div className="messages">
          {chats[currentChatIdx].messages.map((msg, idx) => {
            const isAssistant = msg.role === "assistant";
            const isLong = isAssistant && msg.content.length > ASSISTANT_PREVIEW_LIMIT;
            const expanded = expandedMessages[idx];
            return (
              <div
                key={idx}
                className={`message${msg.role === "user" ? " user" : ""} chat-fade-in`}
              >
                <div className={`avatar ${msg.role}`}>{msg.role === "assistant" ? "S" : "U"}</div>
                <div className="bubble">
                  {isLong && !expanded ? (
                    <>
                      {msg.content.slice(0, ASSISTANT_PREVIEW_LIMIT)}
                      <button className="show-more-btn modern" onClick={() => handleShowMore(idx)} aria-label="Show more of this reply">Show More</button>
                    </>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="message chat-fade-in">
              <div className="avatar assistant">S</div>
              <div className="bubble loader-bubble typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        {showScrollButton && (
          <button className="scroll-to-bottom-btn" onClick={scrollToBottom} aria-label="Jump to Present">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 12l7 7 7-7" stroke="#457b9d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <form className="input-area" onSubmit={sendMessage} autoComplete="off">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your thoughts..."
            disabled={loading}
            aria-label="Type your message"
          />
          <button type="submit" disabled={loading} aria-label="Send message" className="send-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 20L21 12L3 4V10L17 12L3 14V20Z" fill="#457b9d"/>
            </svg>
          </button>
        </form>
        <div className="privacy-note">
          This is a safe, supportive space. Your conversation is private.
        </div>
      </div>
    </div>
  );
}

export default App;
