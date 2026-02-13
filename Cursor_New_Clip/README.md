# HEXGATE - Riot Games Inventory Management

A modern web application for managing League of Legends and Valorant clips and patch notes.

## Features

- 🎨 **Champion-based Themes** - Ahri, Yasuo, Garen, Kalista color themes
- 🌓 **Dark/Light Mode** - Toggle between dark and light modes
- 🌍 **Multi-language Support** - English, 中文, 日本語, 한국어
- 📤 **Clip Upload** - Upload and manage game clips
- 🔍 **Search** - Search for summoners by IGN#Tag
- ⌨️ **Keyboard Shortcuts** - Quick navigation with keyboard
- 🔔 **Toast Notifications** - User-friendly notifications

## Tech Stack

- **Frontend**: HTML5, Tailwind CSS, TypeScript
- **Backend**: Python Flask (NEW_APP.PY)
- **Build Tool**: TypeScript Compiler

## TypeScript Setup

This project uses TypeScript for type-safe JavaScript development.

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

1. **Build TypeScript files** (one-time):
```bash
npm run build
```

2. **Watch mode** (auto-compile on changes):
```bash
npm run watch
```

3. **Development mode** (same as watch):
```bash
npm run dev
```

### Project Structure

```
jweb-dev/
├── types/
│   └── global.d.ts          # TypeScript type definitions
├── dist/                    # Compiled JavaScript (generated)
│   ├── i18n.js
│   └── NEW_Clips.js
├── i18n.ts                  # Internationalization (TypeScript)
├── NEW_Clips.ts             # Main application logic (TypeScript)
├── NEW_main.html            # Main HTML file
├── NEW_Clip.css             # Styles
├── tsconfig.json            # TypeScript configuration
├── package.json             # npm dependencies
└── README.md                # This file
```

### TypeScript Files

- **i18n.ts** - Handles all translations and language switching
- **NEW_Clips.ts** - Main application logic (navigation, uploads, themes, etc.)
- **types/global.d.ts** - Global type definitions for Window interface and custom types

### Building for Production

1. Compile TypeScript:
```bash
npm run build
```

2. The compiled JavaScript files will be in the `dist/` folder:
   - `dist/i18n.js`
   - `dist/NEW_Clips.js`

3. Make sure your HTML references the compiled files:
```html
<script src="dist/i18n.js"></script>
<script src="dist/NEW_Clips.js"></script>
```

### Type Safety

All TypeScript files include:
- ✅ Type annotations for function parameters and return types
- ✅ Interface definitions for data structures
- ✅ Type-safe DOM manipulation
- ✅ Proper error handling

### Key Type Definitions

- `PageName` - Valid page identifiers
- `ThemeName` - Champion theme names
- `LanguageCode` - Supported language codes
- `ToastType` - Notification types
- `GameType` - Game categories (lol/val)
- `I18NTranslations` - Translation structure

## Running the Application

1. **Backend** (Python Flask):
```bash
python NEW_APP.PY
```

2. **Frontend**: Open `NEW_main.html` in a browser or serve via a web server

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT
