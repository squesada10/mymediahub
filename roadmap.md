# 🧩 Step-by-Step Roadmap

## Phase 1 — Start with Watchlist Manager (MVP)

Goal: Make a working, local version of the Watchlist section.

- [] Create basic UI layout inside app/watchlist/page.tsx
  - [] Add section header (“Watchlist Manager”)
  - [] Add placeholder search bar and a list/grid of cards
- [x] Create a mock data file (e.g. data/mockWatchlist.ts)
  - [x] Fill it with sample movie/series objects { id, title, year, status, poster }
- [] Map over mock data to display the cards
  - [] Use Tailwind for layout and spacing
  - [x] Add placeholder poster image and title
- [x] Add a status filter dropdown (To Watch / Watching / Watched)
  - [x] Use local state to filter the list
- [x] Add interactivity
  - [x] Click on a card → opens a modal (detail view)
  - [x] Modal shows title, poster, description, and “Mark as Watched” button
- [] Test all interactions locally

✅ Once this works → you have your UI skeleton + logic

## Phase 2 — Fetch Real Data (TMDB API)

Goal: Replace your mock list with real movie data.

- [] Create .env.local and add your TMDB API key
- [] Build a small API route: app/api/search/route.ts
  - [] Fetch movies/series from TMDB by query
  - [] Return clean JSON (id, title, poster, overview)
- [] Connect the frontend search bar to this API route
- [] Allow adding a searched movie to your local watchlist (in React state)
- [] Optionally: persist list in localStorage

## Phase 3 — Polish the UI

Goal: Make it feel real and beautiful.

- [] Add hover animations with Tailwind and Framer Motion
- [] Add empty state (“No items yet”)
- [] Add loading skeleton for search results
- [] Create consistent button and card components
- [] Write unit tests (Vitest + Testing Library) for core UI
  - [] Render list correctly
  - [] Filter works
  - [] Modal opens on click

## Phase 4 — Build the Other Sections (Using Watchlist as Template)

Goal: Reuse the same patterns and components.

- [] Create app/football/page.tsx
  - [] Mock data → matches
  - [] Cards with opponent, date, and score
  - [] Later: fetch from Football-Data.org API
- [] Create app/games/page.tsx
  - [] Mock data → upcoming releases
  - [] Later: fetch from RAWG.io API

## Phase 5 — Build the Dashboard

Goal: Once the 3 sections exist, make the central view.

- [] Create app/page.tsx (Dashboard)
  - [] Show summary widgets:
    - [] “Movies Watched”, “Next Match”, “Upcoming Game”
  - [] Import lightweight versions of each section’s list component
  - [] Add navigation cards/links to go to full sections
- [] Create app/layout.tsx (global navbar/sidebar)
  - [] Links to: Dashboard, Watchlist, Football, Games, Settings

## Phase 6 — Polish, Persist, Deploy

Goal: Wrap it all up and make it portfolio-ready.

- [] Add theme toggle (light/dark)
- [] Add persistent storage (localStorage or Supabase later)
- [] Write README.md with project summary
- [] Add screenshots or demo GIF
- [] Deploy to Vercel
- [] Add to your portfolio website
