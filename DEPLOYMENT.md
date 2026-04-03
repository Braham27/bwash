# BWash — Deployment & Presentation Guide

## Table of Contents
- [Quick Deploy to Vercel](#quick-deploy-to-vercel)
- [Environment Variables Setup](#environment-variables-setup)
- [Local Development](#local-development)
- [Presenting the Mobile App to Stakeholders](#presenting-the-mobile-app-to-stakeholders)

---

## Quick Deploy to Vercel

### Option A: Vercel Dashboard (Easiest)

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "BWash v1.0 — production ready"
   git push origin main
   ```

2. **Import on Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repo
   - **Root Directory**: `apps/web`
   - **Framework Preset**: Next.js (auto-detected)
   - Build & install commands are configured in `vercel.json`

3. **Add Environment Variables** (see section below)

4. **Deploy** — Vercel handles the rest

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# From project root
cd apps/web
vercel

# Follow prompts, then set env vars:
vercel env add DATABASE_URL production
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
vercel env add CLERK_SECRET_KEY production
vercel env add CLERK_WEBHOOK_SECRET production
vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_URL production    # /sign-in
vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_URL production    # /sign-up
vercel env add NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL production  # /dashboard
vercel env add NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL production  # /dashboard
vercel env add NEXT_PUBLIC_APP_URL production  # https://your-domain.vercel.app

# Deploy to production
vercel --prod
```

---

## Environment Variables Setup

| Variable | Where to Get It | Example |
|---|---|---|
| `DATABASE_URL` | [Neon Console](https://console.neon.tech) → Project → Connection Details | `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/bwash?sslmode=require` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys) | `pk_test_...` or `pk_live_...` |
| `CLERK_SECRET_KEY` | [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys) | `sk_test_...` or `sk_live_...` |
| `CLERK_WEBHOOK_SECRET` | [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=webhooks) → endpoint → Signing Secret | `whsec_...` |

### After Deploy: Set Clerk Webhook

1. Go to [Clerk Webhooks](https://dashboard.clerk.com/last-active?path=webhooks)
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/clerk`
3. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
4. Copy the Signing Secret → set as `CLERK_WEBHOOK_SECRET` in Vercel

### After Deploy: Update Clerk Redirect URLs

In [Clerk Dashboard](https://dashboard.clerk.com) → **Paths**:
- Sign-in URL: `https://your-domain.vercel.app/sign-in`
- Sign-up URL: `https://your-domain.vercel.app/sign-up`
- After sign-in: `https://your-domain.vercel.app/dashboard`
- After sign-up: `https://your-domain.vercel.app/dashboard`

---

## Local Development

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env template and fill in values
cp apps/web/.env.local.template apps/web/.env.local
# Edit .env.local with your actual values

# 3. Push database schema (if first time)
pnpm db:push

# 4. Seed sample data
pnpm db:seed

# 5. Run dev server
pnpm dev
# → Web: http://localhost:3000
```

---

## Presenting the Mobile App to Stakeholders

### Option 1: Expo Go App (Live Demo on Real Device) — RECOMMENDED

Best for quick demos. No build required.

```bash
# From the project root
cd apps/mobile-customer
npx expo start
```

This shows a QR code. Stakeholders scan it with:
- **iOS**: Camera app → opens Expo Go
- **Android**: [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) app

**Pros**: Real device experience, instant, no Apple/Google accounts needed  
**Cons**: Requires Expo Go installed, same WiFi network

### Option 2: Web Preview (Browser Demo)

Perfect for video calls and screen sharing.

```bash
cd apps/mobile-customer
npx expo start --web
# → Opens at http://localhost:8081
```

Use Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M) to simulate mobile.

**Pros**: Works on any computer, easy screen share  
**Cons**: Not native feel, some features may differ

### Option 3: EAS Build (Installable APK/IPA) — BEST FOR FORMAL DEMOS

Creates a real installable app. Takes ~15 minutes to build.

```bash
# Install EAS CLI
npm i -g eas-cli

# Login to Expo
eas login

# Build Android APK (no Play Store account needed)
cd apps/mobile-customer
eas build --platform android --profile preview

# Build iOS Simulator (no Apple Developer account needed)
eas build --platform ios --profile preview
```

Share the download link with stakeholders. Android APK installs directly.

For iOS TestFlight distribution (requires Apple Developer account - $99/year):
```bash
eas build --platform ios --profile production
eas submit --platform ios
```

### Option 4: Appetize.io (Browser-Based Device Simulator)

Upload your APK to [appetize.io](https://appetize.io) for a browser-based phone simulator. Stakeholders get a link — no installs needed.

### Demo Script for Stakeholders

1. **Public Website** → Show homepage, services, booking flow
2. **Customer Flow** → Sign up → Book a wash → View bookings → Manage vehicles
3. **Staff Flow** → Login as staff → View assigned jobs → Update status → Add notes
4. **Admin Dashboard** → Analytics → Manage bookings → Assign staff → Create invoices → Settings
5. **Mobile App** → Same flows on phone → Real-time updates

### Tips for a Professional Presentation

- Use the **gold (#C9A84C) and black theme** — it looks premium in both light and dark rooms
- Pre-book a few sample appointments to show data
- Show the admin view side-by-side with the customer view
- Highlight the real-time status updates (booking → assigned → in_progress → completed)
- Demo the mobile responsive design on the web by resizing the browser

---

## Project Structure

```
bwash/
├── apps/
│   ├── web/              # Next.js 15 web app (main platform)
│   ├── mobile-customer/  # Expo React Native customer app
│   └── mobile-staff/     # Expo React Native staff app
├── packages/
│   └── database/         # Shared Drizzle ORM schema + DB utils
├── turbo.json
└── package.json
```

## Key URLs (After Deploy)

| Page | URL |
|---|---|
| Home | `/` |
| Services | `/services` |
| Book a Wash | `/book` |
| Customer Dashboard | `/dashboard` |
| Customer Bookings | `/dashboard/bookings` |
| Admin Dashboard | `/admin` |
| Admin Bookings | `/admin/bookings` |
| Staff Dashboard | `/staff` |
| Sign In | `/sign-in` |
| Sign Up | `/sign-up` |
