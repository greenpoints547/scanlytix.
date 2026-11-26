# ScanLytix

Smart multi-disease diagnoses across soft tissue organs.

React + Vite front-end with a glass, scan-hologram look: a public website and a patient portal for uploading CT scans, getting AI findings in plain words, and requesting a radiologist report. Works on phones (bottom tab bar) and desktops (floating top navigation).

## Run it

```
npm install
npm run dev
```

On Windows PowerShell, if scripts are blocked, use `npm.cmd install` and `npm.cmd run dev`.

## Pages

| Route | Page |
| --- | --- |
| `/` | Landing page |
| `/about`, `/mission`, `/contact` | Public pages |
| `/login`, `/signup` | Demo sign-in and account pages |
| `/dashboard` | Patient dashboard: pending requests, completed reports, recent activity |
| `/upload` | Upload your CT scan |
| `/scans/:id` | Ready for analysis, then AI results and the scan report |
| `/scans` | My Scans |
| `/requests` | Requests sent to a radiologist |
| `/reports`, `/reports/:id` | Reports list and the radiologist report |
| `/settings` | Profile, theme, reset demo data |

## Demo flow

Sign in (any valid email and a 6+ character password) → Upload Scan → Start Analyzing → Radiologist Review → Requests → Simulate reply → Reports → open the report.

## Connecting your model (Flask)

AI results are simulated. Open `src/lib/analysis.js` and replace the body of `analyzeScan()` with a `fetch` to your Flask endpoint (an example is in the comment). It should return the three scores: nodule, infection, inflammation (0 to 100).

Sign-in is also a demo. Replace `login()` in `src/context/AppContext.jsx` with a real call when your backend is ready.

## Brand

- Logo: `src/assets/logo.png` (transparent, no box), `logo-light.png` (for dark backgrounds) and `logo-mark.png`
- Tagline: `TAGLINE` in `src/config.js`
- Colors: `#EAF7FB` `#BFEAF2` `#63C9D6` `#1E7F8C` `#20343A` (variables at the top of `src/styles/global.css`)
- MRI is hidden for now. Set `ENABLE_MRI = true` in `src/config.js` to bring back MRI mentions in the public copy.

Decision support only. Results must be reviewed by a qualified clinician.

## Design pieces

- `BodyMap` (src/components/BodyMap.jsx): interactive body with soft tissue organs. Lungs are live; liver, pancreas and kidneys are marked Coming soon. Add a new organ by adding an entry to `ORGANS`.
- `Gauge` (src/components/ui.jsx): animated score gauge, teal when low and amber when high.
- Upload flow (src/pages/portal/UploadFlow.jsx): a four-step wizard with symptom chips, a live analyzing screen, and a plain-language result.
- Styles: `global.css` (tokens, glass, buttons), `portal.css` (app), `public.css` (website).
