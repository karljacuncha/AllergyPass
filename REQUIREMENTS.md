# AllergyPass - Requirements Documentation

## 1. Overview

### 1.1 Project Description

AllergyPass is a Progressive Web Application (PWA) that enables travelers with food allergies to communicate their allergies clearly and instantly in any language, even without internet connectivity. The app provides visual emergency cards that can be shown to restaurant staff, medical professionals, security personnel, and other service providers.

### 1.2 Target Users

- Individuals with food allergies traveling internationally
- Parents managing children's allergies while traveling
- Medical professionals requiring quick allergy information
- Security personnel needing to verify medical equipment

### 1.3 Core Value Proposition

- **Offline-first**: Works without internet connection
- **Multi-language**: Supports 10 languages with easy extensibility
- **Family-friendly**: Multiple profiles for family members
- **Privacy-focused**: All data stored locally, no cloud dependency
- **Emergency-ready**: Dedicated emergency communication cards

---

## 2. Technical Architecture

### 2.1 Technology Stack

- **Framework**: SvelteKit 2.0+
- **Build Tool**: Vite 5.0+
- **Adapter**: @sveltejs/adapter-static (for PWA deployment)
- **Language**: JavaScript (ES6+)
- **Styling**: Scoped CSS in Svelte components + global utility classes
- **State Management**: Svelte stores with localStorage persistence
- **Deployment**: Static hosting (Netlify, Vercel, or custom)

### 2.2 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement for older browsers
- Mobile-first responsive design
- PWA installable on iOS and Android

---

## 3. Data Structures

### 3.1 Profile Object

```javascript
{
  id: String,              // Unique identifier (timestamp-based)
  name: String,            // User-provided name (max 30 chars)
  allergies: Array<String> // Array of allergy IDs
}

// Example:
{
  id: "1708264832156",
  name: "Sarah",
  allergies: ["peanuts", "treenuts", "dairy"]
}
```

### 3.2 Allergy Definition

Located in: `/src/lib/data/allergies.json`

```json
{
  "allergies": [
    {
      "id": "peanuts",
      "icon": "🥜"
    }
    // ... more allergies
  ]
}
```

**Current Allergies:**

- peanuts (🥜)
- treenuts (🌰)
- shellfish (🦐)
- dairy (🥛)
- eggs (🥚)
- soy (🫘)
- wheat (🌾)
- fish (🐟)

### 3.3 Language Metadata

Located in: `/src/lib/data/languages.json`

```json
{
  "languages": {
    "en": {
      "name": "English",
      "flag": "🇬🇧"
    }
    // ... more languages
  }
}
```

**Supported Languages:**

- en (English)
- es (Español)
- fr (Français)
- de (Deutsch)
- it (Italiano)
- pt (Português)
- ja (日本語)
- zh (中文)
- ar (العربية)
- hi (हिन्दी)

### 3.4 Translation Schema

Located in: `/src/lib/data/translations/{lang}.json`

```json
{
  "allergies": {
    "peanuts": "Peanuts",
    "treenuts": "Tree Nuts"
    // ... more allergy names
  },
  "phrases": {
    "allergicTo": "I am allergic to",
    "contains": "Does this contain",
    "emergency": "EMERGENCY: I am having an allergic reaction",
    "callAmbulance": "Please call an ambulance",
    "anaphylaxis": "I am going into anaphylactic shock",
    "epipen": "I need my EpiPen"
  },
  "ui": {
    "appTitle": "AllergyPass",
    "settings": "Settings",
    "profiles": "Profiles",
    "addProfile": "Add Profile",
    "editProfile": "Edit Profile",
    "deleteProfile": "Delete Profile",
    "profileName": "Profile name",
    "allergies": "Allergies",
    "interfaceLanguage": "Interface Language",
    "cardLanguages": "Card Languages (Travel Shortlist)",
    "selectAtLeastOne": "Select at least one allergy",
    "save": "Save",
    "cancel": "Cancel",
    "showCards": "Show Cards",
    "setupDescription": "Set up your profile to generate allergy cards",
    "tabInfo": "Info",
    "tabDining": "Dining",
    "tabPharmacy": "Pharmacy",
    "tabEmergency": "Emergency",
    "footerInstructions": "Show this screen to communicate your allergies",
    "noProfiles": "No profiles yet — add one to get started",
    "confirmDelete": "Delete this profile?"
  }
}
```

### 3.5 localStorage Keys

All data persisted to browser localStorage:

```javascript
{
  "ac_interfaceLang": String,        // User's interface language (e.g., "en")
  "ac_cardShortlist": Array<String>, // Languages in quick-switch list
  "ac_activeCardLang": String,       // Currently selected card language
  "ac_profiles": Array<Profile>,     // All user profiles
  "ac_activeProfile": String         // ID of currently active profile
}
```

---

## 4. State Management

### 4.1 Svelte Stores

Located in: `/src/lib/stores/settings.js`

All stores use a custom `persistent()` helper that:

1. Reads from localStorage on initialization
2. Automatically syncs changes back to localStorage
3. Returns a standard Svelte writable store

**Store Definitions:**

```javascript
// Interface language (auto-detected on first load)
export const interfaceLanguage = persistent("ac_interfaceLang", detectLocale());

// Card language shortlist (languages user wants quick access to)
export const cardLanguageShortlist = persistent("ac_cardShortlist", [
  "en",
  "es",
  "fr",
  "de",
  "ja",
]);

// Active card language (currently displayed)
export const activeCardLanguage = persistent("ac_activeCardLang", "en");

// All profiles
export const profiles = persistent("ac_profiles", []);

// Active profile ID
export const activeProfileId = persistent("ac_activeProfile", null);
```

### 4.2 Locale Detection

```javascript
function detectInterfaceLanguage() {
  const locale = (
    navigator.language ||
    navigator.userLanguage ||
    "en"
  ).toLowerCase();
  const localeMap = {
    en: "en",
    es: "es",
    fr: "fr",
    de: "de",
    it: "it",
    pt: "pt",
    ja: "ja",
    zh: "zh",
    ar: "ar",
    hi: "hi",
  };
  const prefix = locale.split("-")[0];
  return localeMap[prefix] || "en";
}
```

Runs once on first load. Subsequent visits use stored preference.

---

## 5. Internationalization (i18n)

### 5.1 Dual-Language Architecture

The app uses **two separate language contexts**:

1. **Interface Language** (`interfaceLanguage` store)
   - Controls all UI text (buttons, labels, settings)
   - Set once by user, rarely changed
   - Used in Settings and Card screens

2. **Card Language** (`activeCardLanguage` store)
   - Controls text displayed on allergy cards
   - Changed frequently via bottom bar dropdown
   - Used only in Card content

### 5.2 Translation Loading

Dynamic imports prevent loading all languages at once:

```javascript
// In components:
let translation = {};

$: if ($interfaceLanguage) {
  import(`$lib/data/translations/${$interfaceLanguage}.json`).then((module) => {
    translation = module.default;
  });
}
```

**Benefits:**

- Smaller initial bundle
- Only load languages user needs
- Easy to add new languages without rebuild

### 5.3 Adding New Languages

**Step 1:** Create translation file

```bash
src/lib/data/translations/ko.json
```

**Step 2:** Add to languages metadata

```json
// src/lib/data/languages.json
{
  "languages": {
    "ko": { "name": "한국어", "flag": "🇰🇷" }
  }
}
```

**Step 3:** Add to locale detection

```javascript
// src/lib/stores/settings.js
const localeMap = {
  // ... existing
  ko: "ko",
};
```

No code changes required in components.

---

## 6. User Interface

### 6.1 Screen Flow

```
[Root Route]
    ├─> Has profiles?
    │   ├─ Yes → /cards
    │   └─ No  → /settings
```

### 6.2 Settings Screen (`/settings`)

**Layout:**

```
┌─────────────────────────────────────┐
│ 🚨 AllergyPass     [Show Cards →]  │
├─────────────────────────────────────┤
│                                     │
│ ┌─ Interface Language ────────────┐│
│ │  <select dropdown>              ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─ Card Languages (Shortlist) ───┐│
│ │  [🇬🇧 English ✓] [🇪🇸 Español ✓]││
│ │  [🇫🇷 Français] [🇩🇪 Deutsch ✓] ││
│ │  ...                            ││
│ └─────────────────────────────────┘│
│                                     │
│ ┌─ Profiles ──────────────────────┐│
│ │  👤 Sarah        [✎] [🗑]       ││
│ │      🥜 🌰 🥛                   ││
│ │                                 ││
│ │  👤 Tommy        [✎] [🗑]       ││
│ │      🥚 🐟                      ││
│ │                                 ││
│ │  [+ Add Profile]                ││
│ └─────────────────────────────────┘│
│                                     │
│    [Show Cards (2 profiles)]        │
└─────────────────────────────────────┘
```

**Components:**

1. **Interface Language Selector**
   - Dropdown (select element)
   - Shows flag emoji + language name
   - Changes immediately affect all UI text

2. **Card Language Shortlist**
   - Grid of language buttons
   - Multi-select (checkboxes styled as buttons)
   - Green border/background when selected
   - Interface language always included (disabled)
   - These languages appear in bottom bar dropdown on card screen

3. **Profile List**
   - Each profile shows:
     - User icon
     - Name
     - Allergy emoji preview
     - Edit button (opens modal)
     - Delete button (shows confirmation)
   - Active profile has blue border/background
   - Empty state: "No profiles yet — add one to get started"

**Profile Editor Modal:**

```
┌────────────────────────────────┐
│ Add/Edit Profile           [✕] │
├────────────────────────────────┤
│ Profile name                   │
│ [_________________________]    │
│                                │
│ Allergies                      │
│ [🥜 Peanuts     ] [🌰 Tree...] │
│ [🦐 Shellfish  ] [🥛 Dairy  ] │
│ [🥚 Eggs       ] [🫘 Soy    ] │
│ [🌾 Wheat      ] [🐟 Fish   ] │
│                                │
│ [Cancel]  [Save]               │
└────────────────────────────────┘
```

- Text input for name (max 30 chars)
- Grid of allergy buttons (toggle select)
- Selected: red border + red background
- Validation: Name required, at least 1 allergy
- Save button disabled until valid

### 6.3 Cards Screen (`/cards`)

**Layout:**

```
┌─────────────────────────────────────┐
│ 🚨 🥜 🌰 🥛              [⚙]        │ ← Top bar
├─────────────────────────────────────┤
│ [🏷️ Info] [🍽️ Dining]              │
│ [💊 Pharmacy] [🚨 Emergency]        │ ← Tab bar
├─────────────────────────────────────┤
│                                     │
│                                     │
│         [Card Content]              │ ← Card area
│                                     │
│                                     │
├─────────────────────────────────────┤
│ [👤 Sarah ▼]    │  [🇪🇸 ▼]         │ ← Bottom bar
├─────────────────────────────────────┤
│ Show this screen to communicate...  │ ← Footer
└─────────────────────────────────────┘
```

**Top Bar:**

- Alert icon (🚨)
- Selected allergy emoji icons (read from active profile)
- Settings cog button (→ /settings)

**Tab Bar:**

- 4 tabs: Info, Dining, Pharmacy, Emergency
- Each tab has:
  - Emoji icon
  - Label (from interface language)
  - Color coding:
    - Info: Blue
    - Dining: Amber
    - Pharmacy: Green
    - Emergency: Red
- Active tab: filled background, white text
- Inactive: white background, colored text + border

**Card Area:**
Main content region displaying current card type (see section 6.4)

**Bottom Bar:**

- **Left side**: Profile switcher dropdown
  - Shows: 👤 icon + profile name + ▼
  - Dropdown: All profiles with emoji preview
  - Active profile highlighted (blue background)
- **Divider**: Vertical line

- **Right side**: Language switcher dropdown
  - Shows: Flag emoji + ▼
  - Dropdown: Languages from shortlist only
  - Active language has checkmark

**Footer:**

- Small gray text
- Instructional message (from interface language)

### 6.4 Card Types

#### 6.4.1 Info Card

**Purpose:** Visual overview of all allergies

**Layout:**

```
┌──────────────────────┐
│                      │
│  🥜        🌰        │
│ Peanuts  Tree Nuts   │
│                      │
│  🥛                  │
│ Dairy                │
│                      │
│ ⚠️  I AM ALLERGIC TO │
└──────────────────────┘
```

**Styling:**

- Allergy icons: 3.75rem (60px) font-size
- Allergy names: 1.125rem, bold
- Warning banner: centered, red text
- Background: white
- Border: 2px blue

#### 6.4.2 Dining Card

**Purpose:** Restaurant communication

**Layout:**

```
┌──────────────────────┐
│                      │
│  I am allergic to    │
│  Peanuts, Tree Nuts, │
│  Dairy               │
│                      │
├──────────────────────┤
│                      │
│  Does this contain   │
│  Peanuts, Tree Nuts, │
│  Dairy?              │
│                      │
└──────────────────────┘
```

**Two boxes:**

1. Blue box: "I am allergic to [list]"
2. Amber box: "Does this contain [list]?"

**Styling:**

- Top box: light blue background, blue border
- Bottom box: light amber background, amber border
- Text: 1.5-2rem, centered
- Allergy list: 1.875rem, bold, red

#### 6.4.3 Pharmacy Card

**Purpose:** Request EpiPen or medication

**Layout:**

```
┌──────────────────────┐
│                      │
│         💊           │
│                      │
│  I need my EpiPen    │
│                      │
│  I am allergic to:   │
│  Peanuts, Tree Nuts, │
│  Dairy               │
│                      │
└──────────────────────┘
```

**Single green box:**

- Pill emoji at top
- EpiPen request
- "I am allergic to:" label
- Allergy list

**Styling:**

- Light green background, green border
- Centered text
- Allergy list: bold, red

#### 6.4.4 Emergency Card

**Purpose:** Medical emergency communication

**Layout:**

```
┌──────────────────────┐
│        🚨            │
│  EMERGENCY: I am     │
│  having an allergic  │
│  reaction            │
│  Peanuts, Tree Nuts, │
│  Dairy               │
├──────────────────────┤
│        📞            │
│  Please call an      │
│  ambulance           │
├──────────────────────┤
│  I am going into     │
│  anaphylactic shock  │
└──────────────────────┘
```

**Three boxes:**

1. Red box (thick border): Emergency message + allergy list
2. Orange box: Call ambulance
3. Light red box: Anaphylaxis message

**Styling:**

- Top box: light red bg, 4px red border
- Middle: light orange bg, orange border
- Bottom: very light red bg, red border
- All uppercase for "EMERGENCY"
- Largest text: 1.5-2rem

### 6.5 Responsive Behavior

**Mobile (< 768px):**

- Single column layouts
- Larger touch targets (min 44x44px)
- Bottom bar stacks on very small screens
- Tab labels may shrink or hide on tiny screens

**Tablet/Desktop (≥ 768px):**

- Wider max-width containers
- Multi-column grids where appropriate
- Hover states on interactive elements

**PWA Viewport:**

- `viewport-fit=cover` for safe area insets
- Full-screen appearance when installed
- No browser chrome when launched from home screen

---

## 7. Functional Requirements

### 7.1 Profile Management

**FR-1: Create Profile**

- User can create a new profile with name and allergies
- Name: Required, max 30 characters
- Allergies: At least 1 required, max 8 available
- New profile becomes active profile automatically
- Profile saved to localStorage immediately

**FR-2: Edit Profile**

- User can edit existing profile name and allergies
- Same validation as creation
- Changes saved immediately
- Active profile status unchanged

**FR-3: Delete Profile**

- User can delete any profile
- Confirmation required (currently window.confirm, TODO: inline UI)
- If deleting active profile, first remaining profile becomes active
- If no profiles remain, redirect to settings screen

**FR-4: Switch Active Profile**

- User can switch active profile from bottom bar dropdown
- Card content updates immediately to show new profile's allergies
- Selection persists across sessions

### 7.2 Language Management

**FR-5: Set Interface Language**

- User can change interface language from settings
- Auto-detected on first launch based on browser locale
- All UI text updates immediately (reactive)
- Persists across sessions

**FR-6: Manage Card Language Shortlist**

- User can add/remove languages from shortlist
- Interface language always included (disabled, can't remove)
- At least 1 language required in shortlist
- If active card language removed, switches to first in shortlist
- Persists across sessions

**FR-7: Switch Card Language**

- User can switch card language from bottom bar dropdown
- Only languages in shortlist shown
- Card content updates immediately
- Does not affect interface language
- Persists across sessions

### 7.3 Card Display

**FR-8: View Cards**

- User can view 4 card types: Info, Dining, Pharmacy, Emergency
- Tab selection persists during session (not across sessions)
- Cards show all allergies from active profile
- Card text in active card language
- Large, clear typography for easy reading at distance

**FR-9: Navigate Cards**

- User can switch between card types via tab bar
- User can switch profile via bottom bar
- User can switch card language via bottom bar
- All navigation instant (no page loads)

### 7.4 Data Persistence

**FR-10: Offline First**

- All data stored in localStorage
- No network requests required for core functionality
- App functions identically online and offline
- Data never leaves user's device

**FR-11: Data Retention**

- Data persists indefinitely until user clears browser data
- No automatic expiration
- No size limits enforced (within browser localStorage limits ~5-10MB)

### 7.5 Accessibility

**FR-12: Keyboard Navigation**

- All interactive elements keyboard accessible
- Tab order logical
- Enter/Space activate buttons
- Escape closes modals/dropdowns

**FR-13: Screen Reader Support**

- ARIA labels on all interactive elements
- ARIA roles for semantic regions
- ARIA states (selected, expanded, etc.)
- Alt text on visual elements

**FR-14: Visual Clarity**

- High contrast ratios (WCAG AA minimum)
- Large touch targets (44x44px minimum)
- Color not sole indicator (icons + text)
- Large default font sizes for cards

---

## 8. Non-Functional Requirements

### 8.1 Performance

- Initial load: < 2 seconds on 3G
- Route transitions: < 100ms
- localStorage operations: < 50ms
- Translation loading: < 200ms (cached after first load)

### 8.2 Reliability

- 99.9% uptime (dependent on hosting)
- Graceful degradation if localStorage unavailable
- No data loss on browser crash/close

### 8.3 Security

- No authentication required
- No personal data transmission
- No external API calls
- No cookies (localStorage only)
- Content Security Policy headers recommended

### 8.4 Privacy

- Zero telemetry/tracking
- No analytics (optional local-only analytics may be added)
- No user identification
- GDPR compliant by design (no data collection)

### 8.5 Browser Compatibility

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions (iOS Safari critical)
- Progressive enhancement for older browsers

### 8.6 Device Compatibility

- Mobile: iOS 13+, Android 8+
- Tablet: All modern tablets
- Desktop: Windows 10+, macOS 10.14+, Linux (recent)
- Screen sizes: 320px to 4K

### 8.7 Internationalization

- Unicode support (UTF-8)
- RTL language support (CSS logical properties)
- Emoji fallbacks for older systems
- Flag emoji display issues on Windows (documented limitation)

---

## 9. Future Enhancements (Not in Scope v1.0)

### 9.1 Security/EpiPen Card

- 5th card type for airport security/police
- Explains EpiPen is necessary medical equipment
- Blue color scheme (official/authoritative)

### 9.2 Service Worker

- Offline asset caching
- Update notifications
- Background sync (if needed)

### 9.3 Export/Import

- QR code generation for profiles
- JSON export/import
- Cross-device profile transfer

### 9.4 Additional Features

- Dark mode
- Custom allergies (user-defined)
- Medication expiry tracking
- Printable wallet cards
- More languages (20+ requested)

---

## 10. Constraints & Assumptions

### 10.1 Technical Constraints

- Client-side only (no backend)
- localStorage 5-10MB limit per origin
- Emoji rendering varies by OS
- Flag emojis not supported on Windows < 10
- Service workers require HTTPS (except localhost)

### 10.2 Assumptions

- Users have modern smartphone (2018+)
- Users understand basic smartphone navigation
- Users responsible for translation accuracy
- Medical advice disclaimer required
- Not a replacement for medical ID bracelets

### 10.3 Out of Scope

- User accounts / authentication
- Cloud sync
- Push notifications
- Native app stores (initially)
- Payment processing
- Medical certification/validation

---

## 11. Testing Requirements

### 11.1 Unit Tests (Selective)

- Store persistence logic
- Locale detection algorithm
- Profile CRUD operations
- Translation loading/fallback

### 11.2 E2E Tests (Priority)

- Create profile → Save → View cards
- Edit profile → Save → Verify changes
- Delete profile → Confirm → Verify removal
- Switch language → Verify UI updates
- Switch card language → Verify card updates
- Offline functionality

### 11.3 Manual Testing

- PWA installation (iOS, Android)
- Offline mode verification
- Cross-browser rendering
- Flag emoji display
- Touch target sizes
- Screen reader navigation

### 11.4 Localization Testing

- Native speaker review of translations
- RTL layout verification (Arabic)
- Special characters display
- Text overflow handling

---

## 12. Deployment

### 12.1 Build Process

```bash
npm run build
```

Generates static files in `/build` directory

### 12.2 Hosting Requirements

- Static file hosting
- HTTPS required (for PWA)
- Gzip/Brotli compression recommended
- Cache headers for assets
- manifest.json at root

### 12.3 Recommended Hosts

- Netlify (automatic deploys from Git)
- Vercel (serverless edge network)
- GitHub Pages (free for public repos)
- Custom: nginx/Apache with SSL

### 12.4 Domain Setup

- Primary: allergypass.symbollix.org
- Consider: allergypass.org / allergypass.app
- SSL certificate required
- CDN optional but recommended

### 12.5 PWA Manifest

Update `/static/manifest.json`:

- start_url: Set to deployment URL
- icons: Generate 192x192 and 512x512 PNG icons
- background_color: Match app theme
- theme_color: #ef4444 (red)

---

## 13. Maintenance

### 13.1 Translation Updates

- Community PRs for new languages
- Review by native speakers
- Translations in separate JSON files (easy to update)
- No code changes required

### 13.2 Allergy Additions

- Edit `/src/lib/data/allergies.json`
- Add translations to all language files
- Add emoji icon
- No component changes required

### 13.3 Version Updates

- SvelteKit: Follow official migration guides
- Dependencies: Keep within major version
- Test PWA functionality after updates
- Verify localStorage compatibility

---

## 14. Documentation

### 14.1 User Documentation

- Landing page explains features
- In-app onboarding (future)
- FAQ (future)
- Video demo (future)

### 14.2 Developer Documentation

- README.md: Setup and architecture
- CONTRIBUTING.md: How to contribute
- TODO.md: Feature roadmap
- Inline code comments for complex logic

### 14.3 Translation Documentation

- Translation template (en.json)
- Style guide for translators
- Testing checklist
- Credit for contributors

---

## 15. Success Metrics

### 15.1 User Metrics (if analytics added)

- Daily active users
- Profiles created
- Languages used most
- Card types viewed most

### 15.2 Project Metrics

- GitHub stars
- Translation contributors
- Issues resolved
- Community engagement

### 15.3 Technical Metrics

- Lighthouse score > 90 (all categories)
- Bundle size < 500KB
- Load time < 2s
- Zero critical bugs

---

## Appendix A: File Structure Reference

```
allergypass/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte           # Root layout (CSS loader)
│   │   ├── +page.svelte             # Router (redirects to cards/settings)
│   │   ├── settings/
│   │   │   └── +page.svelte         # Settings & profile management
│   │   └── cards/
│   │       └── +page.svelte         # Card display
│   │
│   ├── lib/
│   │   ├── components/
│   │   │   └── AllergyCard.svelte   # Card rendering component
│   │   │
│   │   ├── stores/
│   │   │   └── settings.js          # State management + persistence
│   │   │
│   │   └── data/
│   │       ├── allergies.json       # Allergy definitions
│   │       ├── languages.json       # Language metadata
│   │       └── translations/        # i18n files
│   │           ├── en.json
│   │           ├── es.json
│   │           └── ...
│   │
│   ├── app.html                     # HTML template
│   └── app.css                      # Global styles
│
├── static/
│   ├── manifest.json                # PWA manifest
│   ├── icons/                       # App icons
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   └── favicon.png
│
├── svelte.config.js                 # SvelteKit config
├── vite.config.js                   # Vite config
├── package.json                     # Dependencies
├── README.md                        # Developer docs
├── TODO.md                          # Feature roadmap
└── .gitignore
```

---

## Appendix B: Component API Reference

### AllergyCard Component

**Props:**

```javascript
export let type = "info"; // 'info' | 'dining' | 'pharmacy' | 'emergency'
export let selectedAllergies = []; // Array<String> - allergy IDs
export let translation = {}; // Object - translation data
```

**Usage:**

```svelte
<AllergyCard
  type="dining"
  selectedAllergies={['peanuts', 'dairy']}
  translation={cardTranslation}
/>
```

**Styling:**

- Self-contained scoped CSS
- No external dependencies
- Responsive by default

---

## Appendix C: localStorage Schema

```javascript
// Complete localStorage state example
{
  "ac_interfaceLang": "en",

  "ac_cardShortlist": ["en", "es", "fr", "de", "ja"],

  "ac_activeCardLang": "es",

  "ac_profiles": [
    {
      "id": "1708264832156",
      "name": "Sarah",
      "allergies": ["peanuts", "treenuts", "dairy"]
    },
    {
      "id": "1708264899234",
      "name": "Tommy",
      "allergies": ["eggs", "fish"]
    }
  ],

  "ac_activeProfile": "1708264832156"
}
```

---

## Appendix D: Color Palette

```css
/* Grays */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-500: #6b7280;
--gray-700: #374151;
--gray-800: #1f2937;

/* Blues (Info) */
--blue-50: #eff6ff;
--blue-200: #bfdbfe;
--blue-500: #3b82f6;

/* Amber (Dining) */
--amber-50: #fffbeb;
--amber-200: #fde68a;
--amber-500: #f59e0b;

/* Green (Pharmacy) */
--green-50: #f0fdf4;
--green-300: #86efac;
--green-600: #16a34a;

/* Red (Emergency) */
--red-50: #fef2f2;
--red-100: #fee2e2;
--red-200: #fecaca;
--red-500: #ef4444;
--red-600: #dc2626;
--red-700: #b91c1c;

/* Orange (Ambulance) */
--orange-50: #fff7ed;
--orange-300: #fed7aa;
--orange-600: #ea580c;
```

---

## Document History

| Version | Date       | Author  | Changes                             |
| ------- | ---------- | ------- | ----------------------------------- |
| 1.0     | 2026-02-22 | Initial | Complete requirements documentation |

---

**End of Requirements Document**
