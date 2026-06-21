# NMG ZEMBETA — COMPLETE REDESIGN AUDIT & EXECUTION PLAN
## Delivered by COR3 HAUS PROD | BE SEEN. BE TRUSTED. BE CHOSEN.

---

## SECTION 1: BUSINESS UNDERSTANDING

**Company:** NMG Zembeta Pty Ltd  
**Founded:** January 2024, Randburg, South Africa  
**Tagline:** "My World. Your World. Our World."  
**Services:** Cleaning & Laundry, Risk Consulting & Recruitment, Company Diaries/Tags/Pens, Embroidery & Branding, Supply & Corporate Stationery, Custom Car Stickers & Gifts  
**Products:** Pies, Noodles, Lunchbox Treats, Party Packs  
**Payment Flow:** Manual EFT → Upload proof → Admin verifies → Status update  
**Tech Stack:** React 19 + Vite, Firebase (Auth + Firestore + Storage + Functions), GSAP, React Router v7  

---

## SECTION 2: COMPLETE CODEBASE ANALYSIS

### Firebase Architecture (Firestore Collections)
```
/users/{uid}
  - fullName, email, role ('user'|'admin'), agreedToTerms, createdAt
  /cart/{productId}
    - productId, name, price, image, quantity, addedAt
  /orders/{orderId}
    - mirror of main orders doc

/products/{productId}
  - name, description, price_rands, image_urls[], category, available, createdAt, updatedAt

/categories/{categoryId}
  - name, createdAt

/orders/{orderId}
  - userId, userName, userEmail, items[], totalAmount, orderDate, status,
    proofOfPayment (Storage URL), orderId, createdAt
```

### Firebase Functions
- `sendOrderConfirmation` — triggers on new order → emails customer + admin via Nodemailer/Gmail

### Auth Flow
- Email/Password + Google OAuth
- Role-based routing: `user` vs `admin`
- Auth state persisted via `onAuthStateChanged` + Firestore role lookup

---

## SECTION 3: CRITICAL PROBLEMS FOUND

### 🔴 CRITICAL — Must Fix

**1. CSS Global Chaos**
- `main.css` is commented out in `main.jsx` (`//import './assets/styles/main.css'`)
- `App.css` is also commented out
- `index.css` is commented out
- **The app has NO global CSS applied.** Every page relies on its own module CSS in isolation, with zero design consistency.
- `--primary-color`, `--text-light`, `--primary-dark` variables defined in commented-out files don't cascade.

**2. NavBar Width Bug**
- `width: 97vw` on desktop, `width: 90vw` on mobile — causes nav to be misaligned and not full-width.
- Mobile auth panel uses magic number `top: 11rem` and `transform: translateY(200px)` — breaks on devices with different nav heights.

**3. Contact Form is Dead**
- The Contact page has a form with no `onSubmit`, no state, no Firebase write, no email sending. It does nothing.

**4. `fetchProducts` called on every `useEffect` dependency in Admin**
- `fetchProducts` passed as a dep in `useEffect` creates infinite re-render risk.

**5. Cart is unauthenticated for the Cart page**
- `/cart` is a public route but uses `useCart` which requires auth. Unauthenticated users see an empty cart with no explanation.

**6. No 404 Page**
- No catch-all route. Invalid URLs show a blank page.

**7. `firebase-admin` in frontend `package.json`**
- `firebase-admin` and `firebase-functions` are frontend dependencies — they should ONLY be in `/functions/package.json`. This inflates the bundle by ~4MB.

**8. Order Date Display Bug**
- In `OrdersPage`: `new Date(order.orderDate).toLocaleString()` — `orderDate` is a Firestore `serverTimestamp()` (Timestamp object), not a string. This will show `Invalid Date`.

**9. `CartContext.js` is imported but empty**
- The file exists but is completely empty. `useCart` hook in `utils/useCart.js` is used directly everywhere instead. The context file is dead weight.

**10. Status messages on product listing use urgency manipulation**
- Messages like "Checkout now before we run out of stock! 🔥" are fake urgency (no real stock tracking). This erodes trust.

---

### 🟡 DESIGN ISSUES

**11. No design system / no tokens**
- Colors used inconsistently: `#2EC4B6`, `#1E2A38`, `#2F3E46`, `#FFB703`, `rgba(43,45,66,0.7)` repeated ad-hoc across 15+ CSS files with no single source of truth.

**12. Typography is generic**
- Font: `Inter` loaded via `var(--font-family-primary)` — but this variable isn't accessible because main.css is commented out. Fallback is browser default serif.
- No clear typographic hierarchy. H1, H2, H3 sizes inconsistent across pages.

**13. Hero section is weak**
- A low-quality stock image (pexels-rethaferguson) with 70% opacity and a semi-transparent overlay. No storytelling, no motion, no visual hook.
- The CTA button has a CSS `shimmer` animation that feels cheap.

**14. Services section UX is broken on mobile**
- The hover-to-reveal image pattern does not work on touch screens. Mobile users see the service list but can never see product images.

**15. Product cards have no visual hierarchy**
- Product name, description, and price are all similar text weight. The "Add to Cart" button is a flat button with minimal styling.

**16. About Page is copy-only**
- No images, no timeline, no team photos, no visual trust signals. Pure text in cards.

**17. Footer is minimal**
- Social icons are `.ico` files (meant for browser favicons) used as `<img>` — this is incorrect usage and icons likely look broken.
- "Built By JAY_K" attribution with old branding (should say COR3 HAUS PROD).

**18. Loading & error states are plain text**
- `⏳ Loading cart...`, `❌ Error...` — plain `<div>` with emoji. No styled components, no skeleton screens.

**19. Lottie animation referenced but never initialized**
- `<div id="lottie-animation">` in Hero section — there is no Lottie initialization code anywhere.

**20. Custom cursor exists but adds no value**
- `CustomCursor.jsx` — without seeing its CSS, it's likely a vanity feature that could break on low-end devices.

---

### 🟡 UX ISSUES

**21. No search functionality**
- Products page has category filters but no text search. If a user knows what they want, there's no way to find it directly.

**22. Checkout has no order confirmation page**
- After checkout, users are redirected to `/products` with a status message. No dedicated order success page with order number, items purchased, or next steps.

**23. No profile order history UI**
- `ProfilePage.jsx` — exists as a route but content is unknown. Orders are saved to `users/{uid}/orders` but there's no UI to display them.

**24. Cart is accessible from nav only for non-admin users**
- Admin users cannot see the cart link, which makes sense, but the logic is `user.role !== 'admin'` — this would also hide cart from users with any future roles.

**25. No WhatsApp or direct quote flow**
- A multi-service business like this needs a "Get a Quote" CTA that leads to WhatsApp or a structured form. None exists.

**26. No breadcrumbs on Product Details**
- Users who navigate to a product detail page have no breadcrumb trail.

---

### 🟡 PERFORMANCE ISSUES

**27. All product images auto-slide every 3 seconds**
- `useEffect` in `ProductsPage` creates `N` intervals for `N` products. On a page with 20 products, that's 20 simultaneous timers. No cleanup race-condition protection.

**28. No image optimization**
- All images are raw JPEGs/PNGs from Firebase Storage or local assets. No `loading="lazy"`, no `width`/`height` attributes (causes CLS), no WebP conversion.

**29. No code splitting**
- All pages imported synchronously in `AppRouter`. `Suspense` is present but `React.lazy()` is not used — so Suspense does nothing.

**30. `firebase-admin` in bundle**
- As noted: adds ~4MB to production bundle.

**31. ProductContext fetches ALL products on mount**
- No pagination, no limit, no infinite scroll. If 1000 products are added, all 1000 are fetched.

---

### 🟡 SEO ISSUES

**32. Single-page meta tags**
- All meta in `index.html` is static. Product pages, category pages, About, Contact — all share the same title and description.

**33. No dynamic OG images**
- OG image points to `logo.svg` for all pages. Product pages should show the product image.

**34. No sitemap.xml or robots.txt**
- These files are referenced in the SEO plan but don't exist in the project.

**35. Non-semantic HTML in several places**
- `<main>` wrapping inside `<section>` without proper landmark hierarchy in some pages.

**36. Missing `alt` attributes on some images**
- Several `<img>` tags use generic `alt={product.name}` but some service images in HomePage use literal alt text.

**37. No `rel="canonical"` per page**

**38. Schema.org is only LocalBusiness**
- Product pages should have `Product` schema. The store should have `Store` schema. Services should have `Service` schema.

---

### 🟡 ACCESSIBILITY ISSUES

**39. Color contrast failures**
- `#2EC4B6` on `#1E2A38` background has ~2.5:1 contrast ratio — fails WCAG AA (requires 4.5:1 for normal text).
- `#FFB703` yellow on white (#E6E6E6) is borderline.

**40. No skip-to-main-content link**

**41. Form inputs lack proper `aria-label` or `aria-describedby`**
- The contact form has no labels. Checkout form inputs have no error states.

**42. Modal in OrdersPage has no focus trap**
- When the proof-of-payment modal opens, keyboard focus is not trapped.

**43. Hamburger menu not `aria-expanded`**

---

### 🟡 TECHNICAL DEBT

**44. `store/index.js` is unused**
- File exists but is empty, appears to be a Redux/Zustand skeleton never implemented.

**45. `ProductCard.jsx` component is unused**
- A `ProductCard` component was created but the `ProductsPage` renders cards inline. Dead file.

**46. `CartContext.js` is empty and unused**

**47. `useOrders` hook lacks memoization**
- Query is recreated every render.

**48. Console.log in production code**
- Multiple `console.log()` statements in `OrdersPage.jsx` (even inside `.map()`), `AuthContext.jsx`, `ProductsPage.jsx`, `CheckoutPage.jsx`.

**49. `firebase.js` in `/utils/` duplicates firebase init**
- There are two firebase directories: `/src/firebase/` (empty files) and `/src/utils/firebase.js` (the real config). The `/src/firebase/` directory is dead.

---

## SECTION 4: REDESIGN SYSTEM

### New Color System (NMG Brand Evolution)
```
--nmg-ink:       #0D1117  /* Deepest background — premium feel */
--nmg-surface:   #161B22  /* Card & nav background */
--nmg-border:    #21262D  /* Subtle borders & dividers */
--nmg-teal:      #2EC4B6  /* Brand primary — accent only */
--nmg-teal-glow: rgba(46,196,182,0.15)  /* Glow effects */
--nmg-gold:      #C9A94E  /* Premium accent — prices, highlights */
--nmg-text:      #F0F6FC  /* Primary text */
--nmg-muted:     #8B949E  /* Secondary text */
--nmg-success:   #3FB950  /* Success states */
--nmg-warning:   #D29922  /* Warning states */
--nmg-error:     #F85149  /* Error states */
```

### New Typography System
```
Display:   Playfair Display — emotional, premium headlines
Heading:   Syne — modern, distinctive subheadings  
Body:      DM Sans — clean, readable body text
Mono:      JetBrains Mono — prices, codes
```

### New Spacing System
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px

### Motion Principles
- Duration: 200ms (micro), 400ms (standard), 700ms (reveal), 1000ms (hero)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` — the "premium ease"
- Rule: Motion guides attention, never distracts
- Scroll reveals: opacity + translateY(24px) → natural
- Hover states: scale(1.02) + shadow lift
- Page transitions: fade through opacity

---

## SECTION 5: NEW PAGE ARCHITECTURE

### Pages to REBUILD (complete)
1. **HomePage** — New hero, services grid with images always visible (not hover-only), stats counter, featured products, testimonials, WhatsApp CTA
2. **ProductsPage** — Search + filter, skeleton loading, premium product cards
3. **ProductDetails** — Gallery, breadcrumb, related products, sticky CTA
4. **CartPage** — Modern cart with quantity controls and persistent total
5. **CheckoutPage** — 2-column layout, styled bank details, file upload zone, progress indicator
6. **AboutPage** — Visual story section, team/stats, mission/vision with imagery
7. **ContactPage** — Working contact form (EmailJS or Firebase write), map embed, WhatsApp CTA
8. **SignIn/SignUp** — Centered card, branded, Google auth properly styled
9. **AdminDashboard** — Table layout, bulk actions, stats cards
10. **OrdersPage** — Timeline-style status, better proof viewer

### Pages to ADD
11. **OrderSuccessPage** (`/order-success/:id`) — Celebrate the purchase
12. **ProfilePage** — Order history, account settings
13. **NotFoundPage** (`*`) — Branded 404

---

## SECTION 6: PRIORITIZED IMPLEMENTATION ROADMAP

### Phase 1 — Foundation (Critical Fixes) [DO FIRST]
- [ ] Fix global CSS (uncomment + rebuild design tokens)
- [ ] Remove `firebase-admin` from frontend deps
- [ ] Fix `orderDate` Timestamp parsing
- [ ] Fix NavBar width bug
- [ ] Add React.lazy() to all page imports
- [ ] Fix Contact form (write to Firestore)
- [ ] Add 404 page

### Phase 2 — Core Experience Rebuild
- [ ] New design system (tokens, typography, spacing)
- [ ] Rebuild NavBar with scroll behavior + cart count badge
- [ ] Rebuild Footer with proper social icons
- [ ] Rebuild HomePage (hero, services, products, testimonials)
- [ ] Rebuild ProductsPage (search, filters, cards, skeleton)
- [ ] Rebuild ProductDetails (gallery, sticky CTA)
- [ ] Rebuild CartPage
- [ ] Rebuild CheckoutPage + OrderSuccessPage

### Phase 3 — Trust & Conversion
- [ ] Rebuild AboutPage with imagery and stats
- [ ] Rebuild ContactPage with working form + WhatsApp
- [ ] Rebuild Auth pages (SignIn, SignUp)
- [ ] Build ProfilePage with order history
- [ ] Add Toast notification system
- [ ] Add scroll reveal animations

### Phase 4 — Admin & SEO
- [ ] Rebuild AdminDashboard (table, stats cards)
- [ ] Rebuild OrdersPage (timeline status, modal)
- [ ] Dynamic meta tags per page (react-helmet-async)
- [ ] Add sitemap.xml and robots.txt
- [ ] Add Product schema markup
- [ ] Fix accessibility issues (focus traps, aria labels, contrast)

### Phase 5 — Performance
- [ ] Add image lazy loading with blur placeholder
- [ ] Fix product image auto-slide memory leak
- [ ] Add Firestore pagination
- [ ] Remove dead files (store/index.js, CartContext.js, ProductCard.jsx)
- [ ] Add loading skeleton components throughout

---

## SECTION 7: SEO RECOMMENDATIONS

### Immediate (no dev cost)
1. **Google Business Profile** — Verify and optimize for "cleaning services Randburg", "catering Randburg", "embroidery Johannesburg"
2. **Add reviews** — Ask existing customers to leave Google reviews. 5+ reviews dramatically improve local pack ranking.
3. **NAP Consistency** — Ensure Name, Address, Phone are identical across website, GBP, Facebook, Instagram.

### On-Page (implement now)
4. Each product page needs unique `<title>` and `<meta description>`
5. H1 on every page should contain primary keyword (e.g., "Cleaning Services in Randburg, South Africa")
6. Add alt text to ALL images with descriptive keywords
7. Add `sitemap.xml` and `robots.txt`
8. Add `<link rel="canonical">` per page

### Schema Markup to Add
```json
// Product pages
{"@type": "Product", "name": "...", "offers": {"@type": "Offer", "price": "...", "priceCurrency": "ZAR"}}

// Services pages  
{"@type": "Service", "name": "Cleaning Services", "areaServed": {"@type": "City", "name": "Randburg"}}

// Organization
{"@type": "Organization", "name": "NMG Zembeta", "sameAs": [...socials]}
```

### Content Strategy
9. Create a **Blog section** — "How to clean your office", "Best catering for corporate events in Johannesburg" — targets informational searches
10. Create **service landing pages** — /services/cleaning, /services/catering, /services/embroidery — for individual keyword targeting
11. Create **location pages** — expand beyond Randburg as business grows

### Link Building
12. Register on local South African directories: Yellow Pages ZA, Cylex, Hotfrog ZA
13. Partner with other local businesses for mutual linking
14. Submit to Google's Small Business resources

---

## SECTION 8: TRUST & CONVERSION RECOMMENDATIONS

### Add to Homepage
- **Stats strip** — "500+ Orders Completed | Est. 2024 | Randburg, SA | 4.9★ Rating"
- **Client logos** if applicable
- **WhatsApp float button** — biggest conversion driver for SA market

### Add to Product Pages
- **In-stock indicator** (even if just "Available" / "Low Stock")
- **Minimum order info** where relevant
- **WhatsApp to inquire** button

### Add to Checkout
- **Progress indicator** (Cart → Payment → Confirm)
- **Security badges** ("Secure checkout", "SSL protected")
- **Bank details styled as a secure card** not plain text

### Add Throughout Site
- **"Free local delivery"** if applicable — mention it prominently
- **Return policy / FAQ** section
- **"Established 2024, Randburg"** in footer — signals legitimacy

