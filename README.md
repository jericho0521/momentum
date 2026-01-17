# Momentum

A speed reading app that helps you read faster using RSVP (Rapid Serial Visual Presentation).

---

## Why Momentum?

Reading is slow because your eyes spend most of their time *moving* between words, not actually reading them. Momentum eliminates this by displaying one word at a time in a fixed position—your eyes stay still while words flow to you.

**Traditional reading:**
```
Your eyes → jump → across → the → page → word → by → word
```

**Momentum:**
```
Words appear → in → the → same → spot → instantly
```

The result? **2-3x faster reading** with the same (or better) comprehension.

---

## Features

### Import Your Books
- Supports `.txt`, `.pdf`, and `.epub` files
- Extracts text locally—your documents never leave your device
- Offline-capable PDF parsing (no CDN dependencies)

### Speed Control
- Adjustable WPM (100-1000 words per minute)
- Start slow at 200 WPM, work your way up to 500+

### Focus Point (ORP)
- Highlights the optimal character in each word
- Research-backed technique for faster word recognition
- Toggle on/off based on preference

### Natural Reading
- Adds subtle pauses on punctuation (periods, commas)
- Customizable delay: 0-200% extra time per punctuation type
- Makes speed reading feel less robotic

### Progress Tracking
- Auto-saves your position every 10 seconds
- Pick up exactly where you left off
- See reading progress and time remaining

### Dark Mode
- Light, dark, or system theme
- Premium glassmorphism design

---

## How It Works

1. **Import** a book (PDF, EPUB, or TXT)
2. **Open** it in the reader
3. **Tap play** to start RSVP playback
4. **Adjust speed** in settings as you get comfortable

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on specific platforms
npx expo start --web       # Browser
npx expo start --android   # Android
npx expo start --ios       # iOS (macOS only)
```

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Expo SDK 54 | Cross-platform framework |
| React Native | Mobile UI |
| TypeScript | Type safety |
| PDF.js | PDF text extraction |
| epub.js | EPUB parsing |
| AsyncStorage | Local persistence |

---

## License

MIT
