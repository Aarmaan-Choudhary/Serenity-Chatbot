# Serenity - Therapeutic Chat Application

A therapeutic chat application built with React and Express, designed to provide a supportive and empathetic chat experience.

## Features

- 🤖 AI-powered therapeutic conversations
- 💬 Real-time chat interface
- 🌙 Dark/Light mode
- 🎵 Sound effects
- 📱 Responsive design
- 🔒 Secure API communication

Use this link to directly access the website: https://serenity-chatbot-88oz.vercel.app/

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- An OpenRouter API key (get it from [OpenRouter](https://openrouter.ai/))
- A Vercel account (for deployment)

## Project Structure

```
therapeutic-chat-app/
├── frontend/          # React frontend application
├── api/              # Express backend server
└── README.md         # This file
```

## Setup Instructions

### Local Development

#### Backend Setup

1. Navigate to the API directory:
   ```bash
   cd api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the api directory with the following variables:
   ```
   PORT=3001
   OPENROUTER_API_KEY=your_openrouter_api_key
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:3001`

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:3001/api/chat
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## Deployment

### Deploying to Vercel (Recommended)

1. Fork this repository to your GitHub account

2. Go to [Vercel](https://vercel.com) and create a new project

3. Import your forked repository

4. Configure the project settings:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. Add the following environment variables:
   ```
   VITE_API_URL=https://your-project-name.vercel.app/api
   ```

6. Create a new project for the API:
   - Go to your Vercel dashboard
   - Create another project
   - Import the same repository
   - Configure settings:
     - Root Directory: `api`
     - Build Command: `npm install`
     - Output Directory: `.`
     - Install Command: `npm install`

7. Add the following environment variables to the API project:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key
   FRONTEND_URL=https://your-frontend-project.vercel.app
   ```

8. Deploy both projects

### Alternative Deployment Options

#### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Environment: `Node`
   - Node Version: `18.x` (or higher)
4. Add environment variables:
   - `PORT`: `10000` (Required for Render)
   - `NODE_ENV`: `production`
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://serenity-chatbot-88oz.vercel.app`)
5. Click "Create Web Service"

#### Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Set the following:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://your-render-app.onrender.com/api/chat`)

## Environment Variables

### Backend (.env)
- `PORT`: Server port (3001 for local, 10000 for Render)
- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `FRONTEND_URL`: Your frontend URL
- `NODE_ENV`: Environment (development/production)

### Frontend (.env)
- `VITE_API_URL`: Your backend API URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

