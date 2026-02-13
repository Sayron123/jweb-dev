# TypeScript Setup Guide

## Quick Start

Your HTML is now connected to TypeScript! Here's how to use it:

### Option 1: Use Compiled TypeScript (Recommended)

1. **Install Node.js** (if not already installed):
   - Download from https://nodejs.org/
   - Install the LTS version

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Compile TypeScript**:
   ```bash
   npm run build
   ```
   Or on Windows:
   ```bash
   build.bat
   ```

4. **Open your HTML file** - it will automatically use the compiled files from `dist/`

### Option 2: Use Original JavaScript (Fallback)

The HTML automatically falls back to the original JavaScript files (`i18n.js` and `NEW_Clips.js`) if the compiled TypeScript files don't exist in the `dist/` folder.

**Current Status**: Your HTML will use the original JS files until you compile TypeScript.

## File Structure

```
jweb-dev/
├── dist/                    # Compiled JavaScript (created after build)
│   ├── i18n.js             # Compiled from i18n.ts
│   └── NEW_Clips.js         # Compiled from NEW_Clips.ts
├── types/
│   └── global.d.ts          # Type definitions
├── i18n.ts                  # TypeScript source (translations)
├── NEW_Clips.ts             # TypeScript source (main logic)
├── i18n.js                  # Original JavaScript (fallback)
├── NEW_Clips.js             # Original JavaScript (fallback)
├── NEW_main.html            # Main HTML (connected to TS)
└── package.json             # npm configuration
```

## Development Workflow

1. **Edit TypeScript files** (`*.ts`)
2. **Compile**: `npm run build` or `npm run watch` (auto-compile on changes)
3. **Test**: Open `NEW_main.html` in browser
4. **Repeat**: Make changes and rebuild

## How It Works

The HTML file uses this smart loading approach:

```html
<script src="dist/i18n.js" onerror="this.onerror=null; this.src='i18n.js';"></script>
<script src="dist/NEW_Clips.js" onerror="this.onerror=null; this.src='NEW_Clips.js';"></script>
```

- **First**: Tries to load compiled TypeScript from `dist/`
- **Fallback**: If `dist/` files don't exist, automatically uses original JS files
- **No errors**: Works immediately without compilation!

## Benefits of TypeScript

✅ **Type Safety** - Catch errors before runtime  
✅ **Better IDE Support** - Autocomplete and IntelliSense  
✅ **Easier Refactoring** - TypeScript tracks dependencies  
✅ **Self-Documenting** - Types serve as documentation  

## Troubleshooting

**Problem**: Scripts not loading  
**Solution**: Make sure either:
- `dist/i18n.js` and `dist/NEW_Clips.js` exist (after compilation), OR
- `i18n.js` and `NEW_Clips.js` exist (original files)

**Problem**: TypeScript compilation errors  
**Solution**: Check `tsconfig.json` and ensure all types are defined in `types/global.d.ts`

**Problem**: npm not found  
**Solution**: Install Node.js from https://nodejs.org/

## Next Steps

1. ✅ HTML is connected to TypeScript
2. ⏳ Compile TypeScript: `npm run build`
3. ✅ Start developing with type safety!
