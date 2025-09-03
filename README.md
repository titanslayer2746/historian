# Historical Timeline App

A beautiful, interactive timeline application for creating and managing historical events with AI-powered summaries.

## Features

- **Interactive Timeline**: Add, edit, and delete historical events
- **Chronological Sorting**: Events automatically sort by date (supports AD/BC)
- **AI-Powered Summaries**: Hover over timeline dots to see AI-generated historical context
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Data Persistence**: All data is automatically saved to localStorage
- **Modern UI**: Clean, green and white theme with smooth animations

## AI Integration

This app includes Gemini AI integration for generating contextual summaries of historical events. See [GEMINI_SETUP.md](./GEMINI_SETUP.md) for setup instructions.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. (Optional) Set up Gemini AI: See [GEMINI_SETUP.md](./GEMINI_SETUP.md)
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Add Events**: Click "Add Entry" to create new timeline events
- **Edit Events**: Click the edit button on any event card
- **Delete Events**: Click the delete button on any event card
- **AI Summaries**: Hover over timeline dots to see AI-generated historical context
- **Hover Details**: Hover over event cards to see full descriptions

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **AI**: Google Gemini AI
- **Language**: TypeScript
- **State Management**: React Hooks

## Project Structure

```
app/
├── components/
│   ├── Timeline.tsx          # Main timeline component
│   ├── EntryForm.tsx         # Add/edit event form
│   ├── AISummaryBox.tsx      # AI summary display
│   └── Dialog.tsx            # Confirmation dialogs
├── lib/
│   └── ai-service.ts         # Gemini AI integration
├── globals.css               # Global styles and theme
└── page.tsx                  # Main application page
```

## Contributing

Feel free to submit issues and enhancement requests!
