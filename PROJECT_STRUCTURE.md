# Volta FT - Project Structure

## Directory Organization

```
volta-ft/
├── public/
│   ├── volta-ft-logo.svg
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── matches/
│   │   │   ├── MatchTable.tsx
│   │   │   ├── MatchFilters.tsx
│   │   │   ├── MatchCard.tsx
│   │   │   ├── MatchForm.tsx
│   │   │   ├── MatchDetails.tsx
│   │   │   └── GoalscorerInput.tsx
│   │   ├── players/
│   │   │   ├── PlayerList.tsx
│   │   │   ├── PlayerCard.tsx
│   │   │   ├── PlayerForm.tsx
│   │   │   └── PlayerStats.tsx
│   │   ├── analytics/
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── StreakDisplay.tsx
│   │   │   ├── HeadToHead.tsx
│   │   │   ├── GoalsChart.tsx
│   │   │   ├── ResultsPieChart.tsx
│   │   │   └── FormIndicator.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       └── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Home.tsx              # Analytics Dashboard
│   │   ├── Matches.tsx           # Match list/table
│   │   ├── MatchDetail.tsx       # Single match view
│   │   ├── AddMatch.tsx          # Add match form
│   │   ├── EditMatch.tsx         # Edit match form
│   │   ├── Players.tsx           # Player list
│   │   ├── Login.tsx             # Admin login
│   │   └── NotFound.tsx          # 404 page
│   ├── hooks/
│   │   ├── useMatches.ts         # Match queries/mutations
│   │   ├── usePlayers.ts         # Player queries/mutations
│   │   ├── useAnalytics.ts       # Analytics calculations
│   │   ├── useAuth.ts            # Authentication
│   │   └── useMatchFilters.ts    # Filter state management
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client
│   │   ├── utils.ts              # Helper functions
│   │   ├── calculations.ts       # Stats calculations
│   │   └── validations.ts        # Form validation schemas
│   ├── types/
│   │   ├── match.ts              # Match type definitions
│   │   ├── player.ts             # Player type definitions
│   │   ├── analytics.ts          # Analytics type definitions
│   │   └── index.ts              # Export all types
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   ├── index.css                 # Global styles + Tailwind
│   └── vite-env.d.ts             # Vite types
├── .env.local                    # Local environment variables (not committed)
├── .env.example                  # Environment template
├── .gitignore
├── package.json
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite configuration
├── components.json               # shadcn/ui configuration
├── README.md
└── PROJECT_STRUCTURE.md
```

## Key Files Explained

### `src/lib/supabase.ts`
Supabase client initialization and helper functions

### `src/hooks/useMatches.ts`
React Query hooks for:
- Fetching all matches
- Adding new match
- Updating match
- Deleting match

### `src/lib/calculations.ts`
Analytics calculation functions:
- Streak detection
- Win/draw/loss percentages
- Head-to-head records
- Goal statistics

### `src/types/`
TypeScript interfaces for:
- Match (with relations)
- Player (with stats)
- MatchGoal
- Analytics data structures

## Component Hierarchy

```
App
└── Layout
├── Header
│   └── Navigation
└── Routes
├── Home (Analytics)
│   ├── StatsCard (×4)
│   ├── StreakDisplay
│   ├── GoalsChart
│   ├── ResultsPieChart
│   └── HeadToHead
├── Matches
│   ├── MatchFilters
│   └── MatchTable
│       └── MatchCard (mobile)
├── AddMatch / EditMatch
│   └── MatchForm
│       └── GoalscorerInput
├── Players
│   └── PlayerList
│       └── PlayerCard
└── Login
└── LoginForm
```

## State Management

### React Query
- Server state caching
- Automatic refetching
- Optimistic updates
- Mutation handling

### URL State
- Match filters in query params
- Analytics year selection
- Shareable filtered views

### Local State
- Form inputs (React Hook Form)
- UI toggles (React useState)
- Authentication status (Context)

## Styling Approach

### Tailwind CSS
- Utility-first styling
- Responsive design classes
- Custom color palette (red, dark grey, light grey)
- Dark mode support (future)

### shadcn/ui
- Pre-built accessible components
- Customizable with Tailwind
- Consistent design system