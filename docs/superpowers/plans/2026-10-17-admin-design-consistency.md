# Admin Design Consistency & Login Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harmonize the design language of the KilauBuild Admin section (Login & Dashboard) with the warm architectural bento aesthetic of the public site, and completely fix the overlapping input icons on the admin login page.

**Architecture:** Frontend Next.js App Router client components (`/admin/login` and `/admin/dashboard`) styled with Tailwind CSS v4 design tokens (`--font-heading`, `--font-sans`, `--font-numeric`, `--brand-primary`, `--paper`, etc.). Form controls will be decoupled from CSS selector collisions so that left-inset icons have dedicated, generous padding (`!pl-12`) and password visibility toggling.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React icons, TypeScript 5.

**Spec:** `docs/DESIGN_SYSTEM.md` and user-provided screenshot (`media_1792229364453_ab482d9f.png`).

## Global Constraints

- Preserve all existing API routes, contracts, and authentication logic (`postApiData("/auth/login")`, token storage in `localStorage.setItem("kilaubuild_token", ...)`).
- Zero `any` in TypeScript.
- Strictly adhere to KilauBuild brand tokens:
  - Primary Brand Blue: `#005592`
  - Primary Hover: `#0066AE`
  - Dark Navy: `#004475`
  - Accent Sky Blue: `#66B2E0`
  - Soft Background: `#F4F7F8` / `#EAF3F8`
  - Typography: Plus Jakarta Sans for Headings (`font-heading`), Inter for Body (`font-sans`), JetBrains Mono for Numbers (`font-numeric`).
- Clean code with 0 ESLint warnings and 0 TypeScript compilation errors.

---

### Task 1: Fix Form Field Specificity & Utility Icon Overlap in `globals.css`

**Files:**
- Modify: `frontend/src/app/globals.css:226-249`

**Interfaces:**
- Consumes: Tailwind v4 theme variables and base utilities.
- Produces: Layered `.form-field` class where utility padding classes (`pl-10`, `pl-12`, `pr-11`) properly override base padding without specificity collisions.

- [ ] **Step 1: Inspect the current `.form-field` rule in `globals.css`**

Currently line 226 has:
```css
.form-field {
  min-height: 48px;
  width: 100%;
  border: 1px solid #b8c7cf;
  border-radius: 0.75rem;
  background: #ffffff;
  padding: 0.75rem 0.875rem;
  color: var(--ink);
  font-size: 1rem;
  transition:
    border-color 160ms ease-out,
    box-shadow 160ms ease-out;
}
```
Because `padding: 0.75rem 0.875rem;` is a shorthand declared after Tailwind's utility layer, utility classes like `pl-10` do not take precedence or get overwritten on left padding.

- [ ] **Step 2: Update `globals.css` with `@layer components` or explicit utility protection**

Place `.form-field` inside `@layer components` (or define utility-safe padding) and add dedicated input-with-icon classes:

```css
@layer components {
  .form-field {
    min-height: 48px;
    width: 100%;
    border: 1px solid #b8c7cf;
    border-radius: 0.75rem;
    background: #ffffff;
    padding: 0.75rem 0.875rem;
    color: var(--ink);
    font-size: 0.9375rem;
    transition:
      border-color 160ms ease-out,
      box-shadow 160ms ease-out;
  }

  .form-field::placeholder {
    color: #71818d;
  }

  .form-field:focus {
    border-color: var(--brand-primary);
    box-shadow: 0 0 0 3px rgba(102, 178, 224, 0.26);
    outline: none;
  }
}
```

- [ ] **Step 3: Test CSS compilation and linting**

Run: `npm --prefix frontend run lint`
Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/globals.css
git commit -m "fix(frontend): wrap form-field in layer components for utility override safety"
```

---

### Task 2: Redesign Admin Login Page (`/admin/login`) & Resolve Icon Overlap

**Files:**
- Modify: `frontend/src/app/admin/login/page.tsx`

**Interfaces:**
- Consumes: `/auth/login` API endpoint via `postApiData`, `localStorage` token storage, Next.js `useRouter`.
- Produces: Polished login screen with:
  1. Dedicated icon inset wrapper (`left-4`, 18px icon) with `!pl-12` (48px left clearance), preventing any text from colliding with icons.
  2. Interactive password reveal button (`Eye` / `EyeOff`) with accessible `aria-label`.
  3. Left hero panel upgraded to warm architectural bento style (grid lines, brand trust cards, clean typography).
  4. Right card upgraded to rounded-[2rem] with button-in-button CTA matching the landing page.

- [ ] **Step 1: Write input field with guaranteed icon clearance and toggle in `page.tsx`**

Implement input wrappers:
```tsx
{/* Email Field */}
<div>
  <label htmlFor="admin-email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#41596B]">
    Email Admin
  </label>
  <div className="relative">
    <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-[#71818D]">
      <Mail className="h-5 w-5" aria-hidden="true" />
    </div>
    <input
      id="admin-email"
      type="email"
      autoComplete="username"
      placeholder="admin@kilaubuild.com"
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      required
      className="form-field !pl-12 !pr-4 focus:border-[#005592] focus:ring-3 focus:ring-[#66B2E0]/25"
    />
  </div>
</div>

{/* Password Field with Show/Hide Toggle */}
<div>
  <label htmlFor="admin-password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#41596B]">
    Password
  </label>
  <div className="relative">
    <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-[#71818D]">
      <Lock className="h-5 w-5" aria-hidden="true" />
    </div>
    <input
      id="admin-password"
      type={showPassword ? "text" : "password"}
      autoComplete="current-password"
      placeholder="••••••••"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
      required
      className="form-field !pl-12 !pr-12 focus:border-[#005592] focus:ring-3 focus:ring-[#66B2E0]/25"
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute right-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#71818D] transition-colors hover:bg-[#EAF3F8] hover:text-[#005592]"
      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  </div>
</div>
```

- [ ] **Step 2: Upgrade left hero panel to match KilauBuild architectural aesthetic**

- Background: Authentic image (`/bangun dari 0.png` or `/header.png`) with deep navy gradient overlay (`bg-gradient-to-t from-[#071A2B] via-[#004475]/85 to-[#004475]/60`).
- Process / Security Badges:
  - Badge 1: "Area Khusus Tim Internal"
  - 3 Bento Micro-Pills:
    - "Validasi BAP Lapangan"
    - "Lead & Kontak WhatsApp Terpusat"
    - "Akurasi Jadwal Survey"
- Typography:
  - Headline with Plus Jakarta Sans `font-extrabold tracking-[-0.035em] text-white text-3xl xl:text-4xl leading-tight`.

- [ ] **Step 3: Upgrade right login form card**

- Container: `rounded-[2rem] border border-[#CBD8DF] bg-white p-7 sm:p-10 shadow-[0_24px_70px_-32px_rgba(0,68,117,0.18)]`.
- Headings: `font-heading font-extrabold text-[#0A1E2F] text-2xl sm:text-3xl tracking-[-0.035em]`.
- Error Alert: `rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 flex items-start gap-3`.
- Submit Button: Tactile button-in-button design:
  ```tsx
  <button
    type="submit"
    disabled={loading}
    className="group flex min-h-12 w-full items-center justify-between rounded-full bg-[#005592] py-2 pl-6 pr-2 text-sm font-bold text-white shadow-xs transition-all duration-300 hover:bg-[#0066AE] disabled:bg-[#80909A] active:scale-[0.98]"
  >
    <span>{loading ? "Memverifikasi Kredensial..." : "Masuk ke Dashboard CMS"}</span>
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </span>
  </button>
  ```
- Back Link: Pill button `rounded-full border border-[#CBD8DF] bg-white px-5 py-2.5 text-xs font-bold text-[#526474] hover:bg-[#EAF3F8] hover:text-[#005592] transition-colors`.

- [ ] **Step 4: Verify typecheck & lint**

Run: `npx --prefix frontend tsc --noEmit && npm --prefix frontend run lint`
Expected: 0 errors, 0 warnings.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/admin/login/page.tsx
git commit -m "feat(admin): redesign login page with architectural aesthetic and fix input icon overlap"
```

---

### Task 3: Redesign Admin Dashboard Page (`/admin/dashboard`) with Warm Bento Aesthetic

**Files:**
- Modify: `frontend/src/app/admin/dashboard/page.tsx`

**Interfaces:**
- Consumes: `/dashboard/overview`, `/bookings/:id/status`, `/contacts/:id/read` API endpoints.
- Produces: Modern architectural CMS dashboard matching the design system:
  1. Sticky top bar with brand badge, admin profile pill, and tactile logout.
  2. Bento metric cards (`rounded-2xl border border-[#CBD8DF] bg-white`) with `font-numeric tabular-nums`.
  3. Refined Booking survey table with soft-pill statuses and custom status dropdown.
  4. Refined Contact message table with read status indicator and quick actions.

- [ ] **Step 1: Upgrade Dashboard Header & Top Bar**

- Refined sticky header with `h-18` (72px), backdrop blur `bg-white/95 border-b border-[#CBD8DF]`.
- Brand logo with "CMS Admin" pill tag.
- User profile info inside an architectural pill container:
  - Avatar initials circle ("KB" / "AD") in `#005592` on `#EAF3F8`.
  - Name and email with role badge "Super Admin".
  - Refresh button with tactile hover.
  - Logout button with smooth hover state.

- [ ] **Step 2: Upgrade 4-Metric Bento Grid**

Replace rigid connected grid with 4 independent bento cards:
- Class: `rounded-2xl border border-[#CBD8DF] bg-white p-6 shadow-xs transition-all hover:border-[#005592]/40 hover:shadow-md`.
- Label: `text-xs font-bold uppercase tracking-wider text-[#526474]`.
- Counter: `font-numeric text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0A1E2F]`.
- Icon: Housed in rounded-xl container with soft tone background.
- Context note: Status text with subtle colored dot indicator.

- [ ] **Step 3: Upgrade Booking Survey Table**

- Container: `rounded-[2rem] border border-[#CBD8DF] bg-white overflow-hidden shadow-xs`.
- Header: Soft blue title banner with total count and filter info.
- Table Head: `bg-[#F8FAFB] text-xs font-bold uppercase tracking-wider text-[#526474] border-b border-[#CBD8DF]`.
- Status Pills:
  - `PENDING`: `bg-amber-50 text-amber-800 border border-amber-200/80`
  - `CONFIRMED`: `bg-emerald-50 text-emerald-800 border border-emerald-200/80`
  - `COMPLETED`: `bg-blue-50 text-blue-800 border border-blue-200/80`
  - `CANCELLED`: `bg-red-50 text-red-800 border border-red-200/80`
- WhatsApp Action: Tactile pill button with direct WhatsApp URL format (`wa.me/62...`).
- Status Select: Styled dropdown with subtle border and focus ring.

- [ ] **Step 4: Upgrade Pesan Masuk (Contacts) Table**

- Container: `rounded-[2rem] border border-[#CBD8DF] bg-white overflow-hidden shadow-xs`.
- Sender & Message: Clear typography with date in `font-numeric tabular-nums`.
- Read State: Pill badge "Pesan Baru" (`bg-[#EAF3F8] text-[#005592] border border-[#005592]/20`) vs "Sudah Dibaca".
- Action: "Tandai Dibaca" button with check icon.

- [ ] **Step 5: Verify typecheck & lint**

Run: `npx --prefix frontend tsc --noEmit && npm --prefix frontend run lint`
Expected: 0 errors, 0 warnings.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/app/admin/dashboard/page.tsx
git commit -m "feat(admin): modernize dashboard overview with bento cards and refined tables"
```

---

### Task 4: Full Verification, Production Build, and Deployment

**Files:**
- Entire frontend codebase

- [ ] **Step 1: Run comprehensive TypeScript check**

Run: `npx --prefix frontend tsc --noEmit && npx --prefix backend tsc --noEmit`
Expected: 0 errors across frontend and backend.

- [ ] **Step 2: Run ESLint**

Run: `npm --prefix frontend run lint`
Expected: 0 errors, 0 warnings.

- [ ] **Step 3: Run Next.js production build**

Run: `npm --prefix frontend run build`
Expected: All 12 static routes compile and prerender successfully.

- [ ] **Step 4: Commit and Push to GitHub**

```bash
git push origin main
```

- [ ] **Step 5: Deploy to Vercel Production**

Deploy via Vercel CLI:
```bash
npx vercel build --prod --yes
npx vercel deploy --prebuilt --prod
```
Verify live URL: `https://kilau-build.vercel.app/admin/login`.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-10-17-admin-design-consistency.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
