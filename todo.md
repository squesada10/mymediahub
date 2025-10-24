✅ Concept & Planning

- [x] Define core goal — one sentence describing the product (e.g. “Centralize my movies, games and football tracking in one personal dashboard.”)
- [] Define core flows
  - [] Watchlist flow (search → add → mark progress → view details)
  - [] Football flow (select team → view next match → follow live score)
  - [] Game release flow (browse calendar → track release → add to watchlist)
- [] Decide data sources & API contracts
  - [] TMDB (movies/series) — endpoints you’ll use (search, details, images)
  - [] Football API (e.g., Football-Data, API-Football) — endpoints (teams, fixtures, standings)
  - [] RAWG / IGDB (games) — endpoints (upcoming, details)
- [] Decide persistence strategy (localStorage → server DB)
- [] Decide auth strategy (NextAuth vs Clerk vs custom)
- [] Write a one-sentence pitch for each product and for MyMediaHub (portfolio copy)
- [] Define success metrics (what “done” means: e.g., search + persist works, user can create account, basic dashboard shows aggregated items)
- [] List constraints & risks (API rate limits, authentication costs, data licensing)

🎨 Design & UX

- [] Sketch high-level layout for each section (paper or low-fi wireframes)
  - [] Watchlist Manager: search bar, filters, media grid, detail panel, stats widget
  - [] Football Tracker: team selector, next match card, upcoming/results tabs, standings
  - [] Game Release Calendar: calendar/list view, filters, detail modal
- [] Create UI component inventory (all reusable components)
  - [] Header / Nav / Drawer / Footer
  - [] SearchBar, MediaCard, TeamCard, MatchCard, Calendar component
  - [] Modal, SidePanel, Filters, Tags / Badges, Toasts
- [] Choose visual direction (moodboards / color palettes)
  - [] Global theme (light/dark)
  - [] Accent colors for movies/games/football or contextual accents per section
- [] Define interactions & microcopy
  - [] Hover states, click states, confirmation texts, empty states, toasts
  - [] Short labels for buttons and messages (Add → “Add to watchlist”, etc.)
- [] Accessibility checklist (contrast, keyboard nav, aria labels)
- [] Create a small set of mockups for key pages (dashboard + one detail page per section)

⚙️ Project Setup (repo + infra)

- [x] Create repo & initial README
- [x] Decide repo structure (monorepo vs single repo with feature folders)
- [x] Initialize Next.js + TypeScript (pick App or Pages router)
- [] Install & configure tooling
  - [x] Tailwind CSS (or your chosen styling)
  - [x] ESLint + Prettier, Husky pre-commit hooks
  - [x] Vitest + React Testing Library setup
  - [] Configure environment variables (.env.example)
- [x] Add CI skeleton (GitHub Actions) — lint, test, build
- [] Add deployment target (Vercel recommended for Next.js)
- [] Decide DB & ORM (Prisma + SQLite dev → Postgres prod)
- [] Setup staging / preview environments (Vercel previews or similar)

🧩 Component & Feature Implementation — Common Foundation

- [] Create design system folder: Button, Input, Card, Avatar, Modal, Skeleton
- [] Create shared utilities: date utils, formatters, API client wrapper, error handling
- [] Create hooks: useAuth, useFetch (React Query or SWR wrapper), useLocalStorage
- [] Create API client modules (TMDB, Football, RAWG) with single exported functions
- [] Add auth scaffold (NextAuth with GitHub/Email or mocked provider)

🧪 Mock Data Flow (MVP stage before APIs)

- [] Create mock data files for each domain (movies, matches, games)
- [] Wire UI to mock data so flows can be tested offline
- [] Implement Watchlist basic flow with local persistence (localStorage)
- [] Implement Football basic flow using mock fixtures
- [] Implement Game Calendar using mock release dates
- [] Unit tests for core UI flows using mock data
- [] Deploy mock MVP preview (Vercel preview or static export) to share

🔗 API Integration (swap mock for real data)

- [] Register and secure API keys
  - [] TMDB key stored in env, rate limits noted
  - [] Football API key (sign up & check pricing/limits)
  - [] RAWG / IGDB key if needed
- [] Implement server-side API proxies (Next.js API routes) to hide keys and manage requests
- [] Implement caching strategy (stale-while-revalidate with React Query; server-side cache via Vercel or Redis if needed)
- [] Replace mock data with real API calls (validate fields, normalize returned objects)
- [] Handle pagination, edge cases, and errors (404, rate limiting)
- [] Add retry/backoff for failed requests where appropriate

🏷️ Features — Watchlist Manager

- [] Search & results (TMDB) with debounce and keyboard support
- [] Add / Remove / Change status (To Watch, Watching, Watched)
- [] Detail modal with poster, overview, genres, runtime, seasons
- [] Notes & ratings per item (small text + numeric rating)
- [] Local stats: total watched, hours watched (optional)
- [] Shareable public list page (optional)
- [] Sync to server DB when user is logged in (migrations + API routes)
- [] Unit & integration tests for search, add/remove, and detail panel

🏟️ Features — Football Team Tracker

- [] Team search & selector (save favorites)
- [] Next match card (countdown, opponent, competition)
- [] Upcoming / Results list with pagination if necessary
- [] Standings view for competitions (if available)
- [] Live score polling (every minute) or websocket if API supports
- [] Add match to personal calendar (.ics export / calendar link)
- [] Notifications (in-app toast or browser push for updates)
- [] Unit & integration tests for team selection and match updates

🎮 Features — Game Release Calendar

- [] Upcoming releases list (RAWG / IGDB) with filters (platform, genre)
- [] Calendar view (month / list) highlighting tracked games
- [] Detail modal (screenshots, trailers, developer)
- [] Add to Watchlist integration (same store as Watchlist Manager)
- [] Track release changes (date update notifications)
- [] Unit tests for filters, calendar rendering, and add-to-watchlist

🔀 Merge Phase — MyMediaHub Integration

- [] Design unified data model (media item type discriminator: movie/series/game/match)
- [] Create unified search that queries all sources and displays fused results
- [] Build Dashboard: top-level summary and “What’s next” (next item across categories)
- [] User profile & public profile pages (show collections & stats)
- [] Cross-entity features (e.g., “Recommend games based on watched movies”) — start rule-based
- [] Background sync jobs for regularly updating external data (cron or scheduled server functions)
- [] Consolidate storage so watchlists are single source of truth across sections

✅ Testing & QA

- [] Unit tests with Vitest + React Testing Library for components/hooks
- [] API tests using MSW to mock external APIs (stable tests)
- [] E2E tests with Playwright or Cypress for critical flows (search → add → view)
- [] Run accessibility audits (axe or Lighthouse) and fix major issues
- [] Add test coverage reporting to CI pipeline (optional badge)

🚀 CI / CD & Deployment

- [] GitHub Actions pipeline: lint → tests → build → deploy preview
- [] Vercel (or chosen host) deployment for preview & production
- [] Database migrations (Prisma migrate) handled in CI or on deploy
- [] Secrets management (store API keys in Vercel / GitHub secrets)
- [] Set up monitoring & error reporting (Sentry or similar)
- [] Set up basic analytics (Plausible, Google Analytics, or self-hosted) — respect privacy

🧰 Performance, Security & Ops

- [] Ensure API keys are never exposed (use server routes)
- [] Rate limit / backoff handling for external APIs
- [] Use caching layers on expensive endpoints (server-side or CDN)
- [] Implement basic security headers (CSP, HSTS)
- [] Enable HTTPS & domain setup (handled by host, e.g., Vercel)
- [] Plan for backups & DB maintenance (if using production DB)

✨ Visual Polish & Interaction

- [] Add transitions & animations (Framer Motion) for key flows (card hover, modal open)
- [] Improve typography & spacing (tailwind tokens or design token file)
- [] Mobile responsiveness and responsive testing on real devices
- [] Add loading & skeleton states to improve perceived performance
- [] Add theming (dark / light / system)

📝 Finalization & Portfolio Prep

- [] Write project README (installation, run, environment)
- [] Create a short case study page
  - [] Problem statement
  - [] Approach & architecture diagram
  - [] Screenshots / GIFs of core flows
  - [] Tech stack & challenges / lessons learned
- [] Record demo GIFs or short video for main flows
- [] Add CI / test badges to README
- [] Deploy final version & verify live
- [] Add project to portfolio with link to repo and live demo
- [] Optional: Write a blog post walking through architecture or a tricky part you solved

🧭 Maintenance & Next Iterations

- [] Collect feedback from friends / developers and iterate
- [] Add small analytics-backed improvements (what features are used?)
- [] Implement advanced features (recommendation engine, AI assistant, more integrations)
