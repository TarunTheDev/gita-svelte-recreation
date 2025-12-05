# Bhagavad Gita Reader

A beautiful, interactive web application for reading the Bhagavad Gita, featuring Sanskrit text, transliteration, and English translations. Built with modern web technologies to provide an elegant and accessible reading experience.

## About This Project

This project brings the timeless wisdom of the Bhagavad Gita to the web with a clean, user-friendly interface. Whether you're a student of Indian philosophy, a spiritual seeker, or simply curious about this ancient text, this reader makes it easy to explore all 18 chapters and their verses.

## Features

- **Complete Bhagavad Gita**: All 18 chapters with 700+ verses fetched from Sanskrit.ie API
- **Live API Integration**: Real-time verse data from Sanskrit.ie
- **Multiple Display Options**: 
  - Original Sanskrit in Devanagari script
  - Romanized transliteration (IAST) for easy pronunciation
  - Clear English translations
- **Audio Support**: Listen to verse recitations (when available)
- **Beautiful Design**: Elegant UI inspired by traditional Indian aesthetics with a modern twist
- **Chapter Navigation**: Easy browsing through diamond-shaped chapter cards
- **Verse Navigation**: Scroll-style verse selectors for authentic feel
- **Auto-Scroll**: Clicking a verse automatically scrolls to display the content
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile devices
- **Toggle Controls**: Show or hide transliteration and translation as needed

## API Integration

This application uses the **Sanskrit.ie Gita API** to fetch verse data:

### API Details

- **Base URL**: `https://sanskrit.ie/api/geeta.php`
- **Endpoint**: `GET /?q={chapter_number}`
- **Response**: JSON with verse data including Sanskrit text, transliteration, translation, and audio URLs

### Example Request

```bash
curl "https://sanskrit.ie/api/geeta.php?q=1"
```

### Response Structure

```json
{
  "status": 200,
  "message": "Data Listed",
  "data": [
    {
      "geeta_id": "1",
      "chapter_no": "1",
      "shlok_no": "1",
      "lyrics": "<HTML content with Sanskrit, transliteration, translation>",
      "music": "path/to/audio.mp3",
      "qr": "path/to/qr.png"
    }
  ],
  "error": ""
}
```

## Technology Stack

- **SvelteKit** - Modern JavaScript framework for building web applications
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Vite** - Fast build tool and development server
- **Sanskrit.ie API** - Backend API for Bhagavad Gita verse data

## Getting Started

### Prerequisites

Make sure you have Node.js (version 16 or higher) installed on your computer.

### Installation

1. Clone this repository to your local machine
2. Navigate to the project folder in your terminal
3. Install the required dependencies:

```bash
npm install
```

### Running Locally

Start the development server:

```bash
npm run dev
```

Then open your browser and visit `http://localhost:5180` to see the application.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
bhagavad-gita-reader/
├── src/
│   ├── lib/
│   │   ├── api/
│   │   │   └── gita.js     # API integration with Sanskrit.ie
│   │   ├── components/     # Reusable UI components
│   │   ├── stores/         # State management
│   │   └── data/           # Fallback chapter and verse data
│   ├── routes/             # Application pages
│   ├── app.css             # Global styles
│   └── app.html            # HTML template
├── static/
│   └── images/             # Images and icons
└── package.json            # Project dependencies
```

## API Functions

The `src/lib/api/gita.js` file provides these functions:

| Function | Description |
|----------|-------------|
| `getChapterVerses(chapter)` | Fetches all verses for a specific chapter (1-18) |
| `getVerse(chapter, verse)` | Fetches a single verse by chapter and verse number |
| `getChapter(chapter)` | Fetches chapter details including name and verse count |

All functions include automatic fallback to local mock data if the API is unavailable.

## Customization

You can easily customize the look and feel by modifying:
- Colors and styling in `tailwind.config.js`
- Layout components in `src/lib/components/`
- Chapter and verse data in `src/lib/data/`

## Future Enhancements

Some ideas for future development:
- Search functionality across chapters
- Bookmarking favorite verses
- Multiple translation options
- Commentary from different scholars
- Dark mode support
- Offline support with service workers

## Contributing

This is an open project and contributions are welcome! Whether it's fixing bugs, improving documentation, or adding new features, feel free to fork the repository and submit a pull request.

## License

This project is open source and available for educational and personal use. The Bhagavad Gita text itself is in the public domain.

## Acknowledgments

Special thanks to the scholars and translators who have made the Bhagavad Gita accessible to modern readers, and to the open source community for the amazing tools that made this project possible.

---

*May the wisdom of the Gita illuminate your path.*
