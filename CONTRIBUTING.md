# AllergyPass - Contributing

## Project Structure

```
src/
├── routes/
│   ├── +layout.svelte          # Root layout (loads CSS)
│   ├── +page.svelte            # Router (cards or settings)
│   ├── settings/
│   │   └── +page.svelte        # Settings & profile management
│   └── cards/
│       └── +page.svelte        # Card display screen
├── lib/
│   ├── components/
│   │   └── AllergyCard.svelte  # Card component
│   ├── stores/
│   │   └── settings.js         # Reactive stores (localStorage)
│   └── data/
│       ├── allergies.json      # Allergy definitions
│       ├── languages.json      # Language metadata
│       └── translations/       # i18n JSON files
│           ├── en.json
│           ├── es.json
│           └── ...
├── app.html                    # HTML template
└── app.css                     # Global styles

static/
├── manifest.json               # PWA manifest
└── icons/                      # App icons (192x192, 512x512)
```

## Adding Languages

1. Create `src/lib/data/translations/{lang-code}.json`
2. Add entry to `src/lib/data/languages.json`
3. Add mapping in `src/lib/stores/settings.js` (detectLocale function)

See `en.json` for the translation schema.

## Adding Allergies

Edit `src/lib/data/allergies.json`:

```json
{
  "allergies": [{ "id": "newallergy", "icon": "🥕" }]
}
```

Then add translations for `newallergy` in each language file.

## Deployment

### Static Hosting (Netlify, Vercel, GitHub Pages)

```bash
npm run build
```

Deploy the `build/` directory.

### Custom Domain

Update `static/manifest.json` with your domain's metadata.

## PWA Setup

### Icons

Place icons in `static/icons/`:

- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

Generate from a source image at [realfavicongenerator.net](https://realfavicongenerator.net/).

### Service Worker

SvelteKit generates a basic service worker. For advanced offline support, customize in `svelte.config.js`.

## Contributing

Contributions welcome! Areas that need help:

- **Translations** - Add new languages or improve existing ones
- **Allergies** - Suggest additions to the allergy list
- **SVG Flags** - Replace emoji flags with proper SVG icons
- **UI Improvements** - Better mobile UX, animations
- **Testing** - Cross-browser compatibility

### Translation Guidelines

- Keep phrases concise and clear
- Emergency phrases should be unambiguous
- Test with native speakers when possible

## Roadmap

- [ ] Inline confirmation UI (replace `window.confirm`)
- [ ] SVG flag icons (Windows compatibility)
- [ ] Service worker with offline asset caching
- [ ] Export/import profiles (QR code or JSON)
- [ ] Medical ID card format option
- [ ] Dark mode

## License

MIT License - see LICENSE file

## Credits

Built with ❤️ for travelers with allergies
