# Shivam Events

Full-stack event management website — React 18 + Vite 5, Tailwind CSS, Framer Motion, React Router v6, and Supabase (Postgres + Auth + Storage) on the backend.

## Setup

```bash
npm install
cp .env.example .env    # then fill in your Supabase URL and anon key
npm run dev
```

The dev server runs on http://localhost:5173.

### Environment variables

`.env` must use exactly these two names:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### Database

In the Supabase SQL editor, run these **in order**, once:

1. `supabase/schema.sql`
2. `supabase/migration_v2.sql`
3. `supabase/migration_v3.sql`

Then create the storage buckets: `services`, `gallery`, `videos`, `testimonials`, `settings`, and `decoration-inspirations` (this last one needs anonymous write).

Create your admin user under Authentication → Users in the Supabase dashboard. Anyone who can sign in has full admin access.

If you see *"Could not find the 'max_charge' column of 'services' in the schema cache"*, run `migration_v2.sql`, or if the column already exists run:

```sql
NOTIFY pgrst, 'reload schema';
```

### Email notifications (optional)

Booking and contact-form emails go through a Supabase Edge Function using [Resend](https://resend.com). Without a key the function returns quietly and submissions still save to the database.

```bash
supabase functions deploy send-notification
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set NOTIFY_TO=you@example.com
supabase secrets set NOTIFY_FROM=onboarding@resend.dev
```

## Build & deploy

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

Deploy `dist/` to Vercel or Netlify. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the host's environment variables, and add a SPA rewrite (all routes → `/index.html`) so client-side routing works on refresh.

## Routes

**Public:** `/`, `/about`, `/services`, `/services/:slug`, `/gallery`, `/videos`, `/contact`, `/book`

**Admin** (behind Supabase Auth): `/admin/login`, `/admin`, `/admin/home-content`, `/admin/services`, `/admin/gallery`, `/admin/videos`, `/admin/pricing`, `/admin/bookings`, `/admin/messages`, `/admin/testimonials`, `/admin/contact`, `/admin/settings`

## Branding

Black `#111111` / charcoal `#1A1A1A` backgrounds, gold `#F5B82E` accent, off-white `#F5F5F5` content areas. Playfair Display for headings, Inter for body.

## Known leftovers

- `src/components/booking/BudgetIndicator.jsx`, `QuantitySelector.jsx`, and `DecorationImageUpload.jsx` are from an earlier booking flow and are not imported by the current `Booking.jsx` — safe to delete.
- `migration_v2.sql` leaves some unused `bookings` columns in place (`paper_blast_quantity`, `decoration_description`, `decoration_special_requirements`, `decoration_images`) in case that flow is revived.
