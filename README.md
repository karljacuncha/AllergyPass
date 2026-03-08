# AllergyPass

Emergency allergy communication cards for travelers. A free, open-source PWA (Progressive Web App) that works offline.

> 2026-03-08: WIP - don't bother looking at this yet, still in development with lots to fix up 

## Features

✅ **Multi-profile support** - Manage allergies for family members  
✅ **10 languages** - English, Spanish, French, German, Italian, Portuguese, Japanese, Chinese, Arabic, Hindi  
✅ **Quick language switching** - Switch card language with flag dropdown  
✅ **4 card types** - Info, Dining, Pharmacy, Emergency  
✅ **Offline-first** - Works without internet connection  
✅ **Auto locale detection** - Interface language auto-set based on browser  
✅ **Accessible** - ARIA labels, semantic HTML, keyboard navigation

## Tech Stack

- **SvelteKit** - Fast, lightweight framework
- **Vite** - Build tool
- **Static adapter** - For PWA deployment
- **LocalStorage** - Persistent data
- No external dependencies for runtime

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build

```bash
npm run build
```

The production build will be in the `build/` directory.

### Preview Production Build

```bash
npm run preview
```

## Further Reading

- [Requirements](REQUIREMENTS.md)
- [Design Decisions](DESIGN_DECISIONS.md)
- [Contributing](CONTRIBUTING.md)
