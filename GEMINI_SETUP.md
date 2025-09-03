# Gemini AI Integration Setup

This timeline app now includes AI-powered event summaries using Google's Gemini AI. Here's how to set it up:

## 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## 2. Configure Environment Variables

Create a `.env.local` file in your project root and add:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you copied from Google AI Studio.

## 3. Restart Your Development Server

After adding the environment variable, restart your development server:

```bash
npm run dev
```

## 4. Using the AI Feature

Once configured, you can:

- **Hover over timeline dots** to see AI-generated summaries
- **AI summaries appear** on the opposite side of the timeline entry
- **Summaries are cached** to avoid repeated API calls
- **Loading states** show while AI is generating content

## Features

- **Smart Summaries**: AI generates contextual, historical summaries
- **Caching**: Results are cached to improve performance
- **Error Handling**: Graceful fallbacks if API is unavailable
- **Responsive Design**: Summary boxes adapt to timeline layout

## Troubleshooting

- **"API key not configured"**: Make sure your `.env.local` file exists and contains the correct API key
- **"Failed to generate summary"**: Check your internet connection and API key validity
- **Rate limiting**: The free tier has usage limits; consider upgrading if needed

## Security Note

The API key is exposed to the client-side (hence `NEXT_PUBLIC_` prefix). For production use, consider implementing a backend proxy to keep your API key secure.
