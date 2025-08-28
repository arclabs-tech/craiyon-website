# Craiyon Image Generation Challenge

A competitive image generation platform where students compete to create the most similar images to given prompts using AI.

## Features

- **6 Pre-generated Challenge Images**: Students can click on any of the 6 images to start a challenge
- **AI Image Generation**: Uses Nebius AI Studio to generate images based on student prompts
- **Automatic Scoring**: Compares generated images with originals and calculates similarity scores
- **Leaderboard System**: Tracks total scores across all 6 challenges
- **User Authentication**: Simple login system for 200 students (SEAT001-SEAT200)

## Setup Instructions

### 1. Database Setup (Vercel Postgres)

1. Create a Vercel Postgres database
2. Get your database connection details
3. Set up environment variables:

```env
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_PORT=5432
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize Database

```bash
# Start the development server first
npm run dev

# In another terminal, run the setup script
npm run setup
```

### 4. Access the Application

Visit `http://localhost:3000` and you'll be redirected to the login page.

## User Credentials

The system automatically creates 200 user accounts:

- **Usernames**: SEAT001, SEAT002, SEAT003, ..., SEAT200
- **Passwords**: S1, S2, S3, ..., S200

## How It Works

### 1. Challenge Selection

- Students see 6 pre-generated images on the homepage
- Each image represents a different challenge
- Images are displayed in a 3x2 grid layout

### 2. Image Generation

- Students click on any challenge image
- They enter a prompt describing what they want to generate
- The system uses Nebius AI to generate an image based on their prompt

### 3. Scoring System

- The system compares the generated image with the original
- Uses a combination of:
  - Image similarity (random score between 0.5-1.0 for demo)
  - Prompt similarity (keyword matching)
- Takes the higher score between the two methods
- Scores range from 0.5 to 1.0

### 4. Leaderboard

- Students can only submit once per challenge
- Total score is the sum of all 6 challenge scores
- Leaderboard shows top 50 performers
- Real-time updates when new submissions are made

## Challenge Images

The 6 challenge images are:

1. Happy Dog
2. Astro Horse
3. Hot Soup
4. The Throne
5. Vibing Girl
6. Red Aura

## Technical Details

### Database Schema

- **users**: User accounts and total scores
- **challenges**: The 6 challenge images and their prompts
- **submissions**: Student submissions with scores

### API Endpoints

- `/api/auth/login` - User authentication
- `/api/auth/logout` - User logout
- `/api/challenges` - Get all challenges
- `/api/generate-and-score` - Generate image and calculate score
- `/api/leaderboard` - Get leaderboard data
- `/api/init` - Initialize database

### Scoring Algorithm

Currently uses a simplified scoring system:

- Random score between 0.5-1.0 for image similarity
- Keyword matching for prompt similarity
- Can be enhanced with proper image embedding comparison

## Future Enhancements

1. **Better Image Comparison**: Implement proper image embedding and cosine similarity
2. **Real-time Updates**: WebSocket integration for live leaderboard updates
3. **Advanced Scoring**: More sophisticated prompt and image analysis
4. **Admin Panel**: Manage challenges and view detailed analytics
5. **Export Features**: Download leaderboard data and statistics

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your environment variables
   - Ensure your Vercel Postgres database is running

2. **Image Generation Fails**
   - Verify your Nebius API key is valid
   - Check API rate limits

3. **Setup Script Fails**
   - Make sure the development server is running
   - Check that all dependencies are installed

### Support

For technical support, check the logs in your terminal and browser console for error messages.
