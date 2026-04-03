# BWash — Deployment & Presentation Guide

## Live URLs

| Service | URL |
|---|---|
| **Production Website** | [https://bwash.vercel.app](https://bwash.vercel.app) |
| **GitHub Repository** | [https://github.com/Braham27/bwash](https://github.com/Braham27/bwash) |
| **Vercel Dashboard** | [Vercel Project](https://vercel.com/homecares-projects-c9481da2) |
| **Neon Database** | [Neon Console](https://console.neon.tech) — Project: `floral-hill-54541608` |
| **Clerk Auth** | [Clerk Dashboard](https://dashboard.clerk.com) |
| **Expo EAS** | Project ID: `a2a2e256-13f2-4278-8fe7-1c95d2fc425c` / Owner: `acadet` |

## Table of Contents
- [Quick Deploy to Vercel](#quick-deploy-to-vercel)
- [Environment Variables Setup](#environment-variables-setup)
- [Local Development](#local-development)
- [Mobile App (Expo EAS)](#mobile-app-expo-eas)
- [Presenting the Mobile App to Stakeholders](#presenting-the-mobile-app-to-stakeholders)

---

## Quick Deploy to Vercel

The project is already deployed and connected:

- **GitHub**: [Braham27/bwash](https://github.com/Braham27/bwash) (public)
- **Vercel**: Project `prj_OsaUUqCRdjF6BoJbRCJJyPT4bCGs`, Root Directory set to `apps/web`
- **Auto-deploy**: Every push to `main` triggers a Vercel production deployment

### Re-deploying

```bash
# Push changes — Vercel auto-deploys from main
git add .
git commit -m "your changes"
git push origin main
```

Or manually via CLI:

```bash
cd apps/web
npx vercel deploy --prod
```

### Vercel Project Settings

| Setting | Value |
|---|---|
| Root Directory | `apps/web` |
| Framework | Next.js |
| Build Command | `next build` (via `vercel.json`) |
| Install Command | `cd ../.. && pnpm install` (via `vercel.json`) |
| Output Directory | `.next` |
| Node.js Version | 22.x |

---

## Environment Variables Setup

### Required Environment Variables (Vercel)

Set these in the [Vercel Dashboard](https://vercel.com/homecares-projects-c9481da2/bwash/settings/environment-variables):

| Variable | Where to Get It | Status |
|---|---|---|
| `DATABASE_URL` | [Neon Console](https://console.neon.tech) → Project `floral-hill-54541608` → Connection Details → Connection string | ⚠️ **Set manually** (password not exportable via API) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys) | ✅ Set |
| `CLERK_SECRET_KEY` | [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys) | ✅ Set |
| `CLERK_WEBHOOK_SECRET` | [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=webhooks) → endpoint → Signing Secret | ⚠️ Set after creating webhook |
| `RESEND_API_KEY` | [Resend Dashboard](https://resend.com/api-keys) → Create API key | ⚠️ **Set manually** |
| `NEXT_PUBLIC_APP_URL` | Your production URL | Set to `https://bwash.vercel.app` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Static value: `/sign-in` | ✅ Set |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Static value: `/sign-up` | ✅ Set |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Static value: `/dashboard` | ✅ Set |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Static value: `/dashboard` | ✅ Set |

### Neon Database Details

| Property | Value |
|---|---|
| Project | `floral-hill-54541608` |
| Endpoint | `ep-muddy-glitter-aelo7t2i` |
| Region | `aws-us-east-2` |
| Database | `neondb` |
| User | `neondb_owner` |
| Tables | 14 (users, bookings, vehicles, packages, services, invoices, memberships, notifications, etc.) |

**DATABASE_URL format**: `postgresql://neondb_owner:<PASSWORD>@ep-muddy-glitter-aelo7t2i.us-east-2.aws.neon.tech/neondb?sslmode=require`

> Get the password from the [Neon Console](https://console.neon.tech) → Project → Connection Details → show password

### After Deploy: Set Clerk Webhook

1. Go to [Clerk Webhooks](https://dashboard.clerk.com/last-active?path=webhooks)
2. Add endpoint: `https://bwash.vercel.app/api/webhooks/clerk`
3. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
4. Copy the Signing Secret → set as `CLERK_WEBHOOK_SECRET` in Vercel

### After Deploy: Update Clerk Redirect URLs

In [Clerk Dashboard](https://dashboard.clerk.com) → **Paths**:
- Sign-in URL: `https://bwash.vercel.app/sign-in`
- Sign-up URL: `https://bwash.vercel.app/sign-up`
- After sign-in: `https://bwash.vercel.app/dashboard`
- After sign-up: `https://bwash.vercel.app/dashboard`

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

## Mobile App (Expo EAS)

The mobile customer app is linked to Expo EAS for building and distributing.

| Property | Value |
|---|---|
| Project ID | `a2a2e256-13f2-4278-8fe7-1c95d2fc425c` |
| Owner | `acadet` |
| Slug | `bwash` |
| Bundle ID (iOS) | `com.bwash.customer` |
| Package (Android) | `com.bwash.customer` |
| App Directory | `apps/mobile-customer/` |

### Building with EAS

```bash
cd apps/mobile-customer

# Set your Expo token (or use `eas login`)
export EXPO_TOKEN=<your-expo-access-token>

# Build for Android (APK for testing)
npx eas-cli build --platform android --profile preview

# Build for iOS Simulator
npx eas-cli build --platform ios --profile preview

# Production builds
npx eas-cli build --platform android --profile production
npx eas-cli build --platform ios --profile production
```

### Staff App

The staff app is at `apps/mobile-staff/`. It has not yet been linked to EAS — run `eas init` in that directory when ready.

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

## Key URLs (Production: https://bwash.vercel.app)

| Page | URL |
|---|---|
| Home | [`/`](https://bwash.vercel.app/) |
| Services | [`/services`](https://bwash.vercel.app/services) |
| Book a Wash | [`/book`](https://bwash.vercel.app/book) |
| Customer Dashboard | [`/dashboard`](https://bwash.vercel.app/dashboard) |
| Customer Bookings | [`/dashboard/bookings`](https://bwash.vercel.app/dashboard/bookings) |
| Customer Membership | [`/dashboard/membership`](https://bwash.vercel.app/dashboard/membership) |
| Admin Dashboard | [`/admin`](https://bwash.vercel.app/admin) |
| Admin Bookings | [`/admin/bookings`](https://bwash.vercel.app/admin/bookings) |
| Staff Dashboard | [`/staff`](https://bwash.vercel.app/staff) |
| Sign In | [`/sign-in`](https://bwash.vercel.app/sign-in) |
| Sign Up | [`/sign-up`](https://bwash.vercel.app/sign-up) |

## Systems Status

| System | Status | Notes |
|---|---|---|
| **Booking + Tips** | ✅ Ready | Tip presets ($5/$10/$15/$20) + custom amount on booking form |
| **Membership** | ✅ Ready | Subscribe/pause/cancel/resume via API + dashboard UI |
| **Email (Resend)** | ✅ Ready | Booking confirmation, invoice, payment receipt, membership welcome — requires `RESEND_API_KEY` |
| **Notifications** | ✅ Ready | In-app notifications for booking lifecycle, payments, invoices, memberships, staff assignments |
| **Auth (Clerk)** | ✅ Ready | Role-based: customer/staff/admin — keys configured |
| **Database (Neon)** | ✅ Ready | 14 tables, Drizzle ORM, pooled connection |
| **Mobile (Expo)** | 🔄 In Progress | Customer app linked to EAS, staff app pending |
