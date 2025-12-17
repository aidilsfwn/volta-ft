# Volta FT - Product Specification

## 1. Executive Summary

### Purpose
A simple, fast dashboard for tracking Volta FT futsal team match results, player statistics, and performance analytics. Admins can manage data while the public can view all statistics and history.

### Target Users
- **Admins (2):** Team managers who log match results and manage player data
- **Public:** Team supporters, players, and anyone interested in team statistics

### Success Criteria
- Log a match result in under 30 seconds
- Fast, filterable match history
- Comprehensive analytics at a glance
- Mobile-friendly for admins
- Responsive viewing experience for public
- Zero operational costs

---

## 2. Core Features

### 2.1 Match Management (Admin Only)

**Add Match**
- Match date (required)
- Opposition team name (free text, required)
- Volta FT score (required, integer)
- Opposition score (required, integer)
- Goalscorers (select from player list, with goal count for each)
- Result (auto-calculated: Win/Draw/Loss based on score difference)

**Match List/Table**
- All matches displayed in table format
- Columns: Date, Opposition, Score, Result, Goalscorers
- Default sort: Most recent first
- Mobile-responsive table design

**Edit Match**
- Update any field
- Re-calculate result if scores change
- Update goalscorer selections

**Delete Match**
- Soft confirmation required
- Permanent deletion from database

**Business Rules:**
- Result auto-calculated: Win (Volta > Opposition), Draw (Equal), Loss (Volta < Opposition)
- Date cannot be in the future
- Scores must be non-negative integers
- Goalscorers total must match Volta FT score
- If Volta scores 0, no goalscorers required

---

### 2.2 Player Management (Admin Only)

**Player List**
- View all players who have scored for Volta FT
- Each player shows: name, total goals, total matches played
- Sort by: name, goals (descending), appearances

**Add Player**
- Player name (required, unique)
- Auto-created when adding to match
- Or can be pre-added to system

**Edit Player**
- Update name only
- Cannot delete if player has goal records

**Business Rules:**
- Player names must be unique
- Case-insensitive duplicate checking
- Player list grows organically as matches are added
- Players with 0 goals still appear in list if pre-added

---

### 2.3 Match History (Public View)

**Table Display**
- Clean, readable table
- Columns: Date, Opposition, Score, Result, Goalscorers
- Pagination: 20 matches per page
- Mobile: Cards on small screens, table on large screens

**Filtering**
- **Default:** All time (all matches)
- **Opposition:** Search/filter by team name (partial match)
- **Year:** Dropdown of all years with matches
- **Result:** Filter by Win/Draw/Loss
- Multiple filters can be combined

**Sorting**
- Default: Date descending (most recent first)
- Click column headers to sort
- Secondary sort: Date for ties

**Empty States**
- No matches: "No matches found. Check back soon!"
- No filtered results: "No matches match your filters. Try adjusting them."

**Business Rules:**
- All matches visible to public
- Real-time updates (no refresh needed)
- Clean URL structure: `/matches?opposition=TeamName&year=2025&result=win`

---

### 2.4 Player Statistics (Public View)

**Top Scorers Table**
- Player name, goals, matches played, goals per match
- Default: Top 10 scorers
- Expandable to show all players
- Sort options: Goals, appearances, goals per match

**Player Detail Page (Optional Enhancement)**
- Individual player statistics
- List of matches where they scored
- Goal breakdown by opposition

**Business Rules:**
- Minimum 1 goal to appear in top scorers
- Goals per match rounded to 2 decimal places
- Players with equal goals sorted by name alphabetically

---

### 2.5 Analytics Dashboard (Public View)

**Overview Statistics**
- Total matches played
- Total wins / draws / losses (with percentages)
- Total goals scored
- Total goals conceded
- Goal difference
- Win percentage
- Current form (last 5 matches: W/D/L indicators)

**Streak Tracking**
- Current streak (e.g., "3 wins in a row")
- Longest winning streak (all-time)
- Longest unbeaten run (wins + draws)
- Longest losing streak (to avoid)

**Performance Breakdown**
- Wins by margin (1 goal, 2-3 goals, 4+ goals)
- Most common scoreline
- Clean sheets count
- Matches scoring 5+ goals

**Head-to-Head Records**
- Top 5 most played opponents
- Record against each (W-D-L)
- Goal difference vs each

**Goal Statistics**
- Average goals scored per match
- Average goals conceded per match
- Highest scoring match
- Biggest win (by goal difference)
- Biggest loss (by goal difference)

**Yearly Comparison (If multiple years)**
- Year-over-year win percentage
- Goals scored trend
- Performance improvement indicators

**Year Filter**
- Dropdown: "All Time" (default) or specific year
- All stats recalculate based on selection
- URL reflects selection: `/analytics?year=2025`

**Visualization**
- Bar chart: Monthly results distribution
- Pie chart: Win/Draw/Loss percentage
- Line chart: Goals scored/conceded over time (if 10+ matches)
- Bar chart: Top 5 scorers

**Business Rules:**
- Minimum 3 matches for meaningful streak stats
- Empty state for insufficient data
- All calculations update in real-time
- Performance metrics rounded to whole numbers or 1 decimal

---

## 3. User Interface Design

### 3.1 Navigation Structure

**Public Navigation (Top Bar):**
- Logo/Name: "VOLTA FT"
- Matches (default landing page)
- Players
- Analytics
- Admin Login (far right)

**Admin Navigation (When Logged In):**
- Logo/Name: "VOLTA FT"
- Matches
- Players
- Analytics
- **Add Match** (emphasized button)
- Logout

**Mobile Navigation:**
- Hamburger menu
- Same links in drawer
- Bottom fixed "Add Match" button when admin logged in

### 3.2 Design System

**Color Palette:**
- **Background:** Dark Grey (#1a1a1a, #2d2d2d)
- **Primary:** Red (#dc2626 or custom team red)
- **Secondary:** Light Grey (#9ca3af)
- **Tertiary:** White (#ffffff)
- **Success:** Green (#10b981) for wins
- **Warning:** Yellow (#f59e0b) for draws
- **Danger:** Red (#ef4444) for losses

**Typography:**
- Headers: Bold, clean sans-serif
- Body: Regular weight
- Numbers: Tabular figures for alignment

**Components:**
- Buttons: Rounded, clear hover states
- Tables: Zebra striping, hover rows
- Cards: Subtle shadow, rounded corners
- Forms: Clear labels, inline validation
- Filters: Chip-style toggles

**Spacing:**
- Mobile: Generous touch targets (48px minimum)
- Desktop: Comfortable padding and margins
- Consistent 4px/8px/16px/24px/32px scale

### 3.3 Responsive Breakpoints

- **Mobile:** < 640px (single column, cards)
- **Tablet:** 640px - 1024px (2 columns where appropriate)
- **Desktop:** > 1024px (full table layouts)

### 3.4 Key Screens

**Landing Page (Public Matches View):**
```
┌─────────────────────────────────────────────┐
│ [VOLTA FT]    Matches  Players  Analytics  │
│                              [Admin Login]  │
├─────────────────────────────────────────────┤
│                                              │
│  [All Time ▼] [Opposition ▼] [Result ▼]    │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ Date     Opposition    Score   Result  │ │
│  │ 15/12/24 Thunder FC    5-2     WIN    │ │
│  │ 08/12/24 Strikers      2-2     DRAW   │ │
│  │ 01/12/24 City United   1-3     LOSS   │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  [← Previous]              [Next →]         │
└─────────────────────────────────────────────┘
```

**Add Match Page (Admin):**
```
┌─────────────────────────────────────────────┐
│ ← Back to Matches                           │
│                                              │
│ Add Match Result                            │
│                                              │
│ Date                                         │
│ [📅 15/12/2024        ]                     │
│                                              │
│ Opposition Team                              │
│ [Thunder FC           ]                     │
│                                              │
│ Score                                        │
│ Volta FT [5] - [2] Opposition               │
│                                              │
│ Goalscorers (Total: 5 goals)               │
│ [Select player ▼] [2 goals]  [+ Add]       │
│ • John Doe (2)                [Edit][×]     │
│ • Jane Smith (2)              [Edit][×]     │
│ • Mike Wilson (1)             [Edit][×]     │
│                                              │
│           [Cancel]  [Save Match]            │
└─────────────────────────────────────────────┘
```

**Analytics Dashboard:**
```
┌─────────────────────────────────────────────┐
│ Analytics              [All Time ▼] [2025]  │
├─────────────────────────────────────────────┤
│                                              │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│ │ Matches │ │  Goals  │ │Win Rate │        │
│ │   24    │ │ 78 - 45 │ │  58.3%  │        │
│ └─────────┘ └─────────┘ └─────────┘        │
│                                              │
│ Results: 14W - 3D - 7L                      │
│ Form: W W L D W                             │
│                                              │
│ Longest Winning Streak: 5 matches          │
│ Current Streak: 2 wins                      │
│                                              │
│ [Goals Chart] [Results Pie] [Top Scorers]  │
└─────────────────────────────────────────────┘
```

---

## 4. Technical Stack

### 4.1 Frontend
- **React 18+** with TypeScript
- **Vite** - Build tool and dev server
- **React Query (TanStack Query)** - Data fetching, caching, mutations
- **React Router** - Navigation and routing
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality UI components
- **Recharts** - Chart visualizations
- **Lucide React** - Icon library
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation

### 4.2 Backend & Database
- **Supabase** - PostgreSQL database, authentication, real-time updates
- **Supabase Auth** - Email/password authentication for admins
- **Supabase Row Level Security (RLS)** - Access control

### 4.3 Hosting & Deployment
- **Vercel** or **Netlify** - Frontend hosting
- **Automatic deployments** from Git
- **Preview deployments** for PRs
- **Custom domain** (optional)

### 4.4 Database Schema

**users table** (Supabase Auth built-in)
- id (uuid, primary key)
- email (text, unique)
- created_at (timestamp)

**players table:**
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**matches table:**
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_date DATE NOT NULL,
  opposition_team TEXT NOT NULL,
  volta_score INTEGER NOT NULL CHECK (volta_score >= 0),
  opposition_score INTEGER NOT NULL CHECK (opposition_score >= 0),
  result TEXT NOT NULL CHECK (result IN ('Win', 'Draw', 'Loss')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**match_goals table:**
```sql
CREATE TABLE match_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  goals_count INTEGER NOT NULL CHECK (goals_count > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(match_id, player_id)
);
```

**Indexes:**
```sql
CREATE INDEX idx_matches_date ON matches(match_date DESC);
CREATE INDEX idx_matches_opposition ON matches(opposition_team);
CREATE INDEX idx_matches_result ON matches(result);
CREATE INDEX idx_match_goals_match ON match_goals(match_id);
CREATE INDEX idx_match_goals_player ON match_goals(player_id);
```

**Views for Analytics:**
```sql
-- Player statistics view
CREATE VIEW player_stats AS
SELECT 
  p.id,
  p.name,
  COALESCE(SUM(mg.goals_count), 0) as total_goals,
  COUNT(DISTINCT mg.match_id) as matches_played,
  ROUND(COALESCE(SUM(mg.goals_count)::numeric / NULLIF(COUNT(DISTINCT mg.match_id), 0), 0), 2) as goals_per_match
FROM players p
LEFT JOIN match_goals mg ON p.id = mg.player_id
GROUP BY p.id, p.name
ORDER BY total_goals DESC, p.name ASC;
```

---

## 5. Feature Specifications

### 5.1 Authentication & Authorization

**Admin Setup:**
- 2 admin accounts pre-created in Supabase
- No public registration
- Credentials managed directly in database

**Login Flow:**
1. Admin clicks "Admin Login"
2. Email/password form
3. Supabase Auth handles validation
4. On success: redirect to admin dashboard
5. JWT token stored, auto-refresh

**Authorization:**
- Public routes: All viewing pages
- Protected routes: Add/edit match, manage players
- Row Level Security policies:
  - Public: SELECT on all tables
  - Authenticated: INSERT, UPDATE, DELETE on matches, players, match_goals

**Session Management:**
- Auto-logout after 7 days inactive
- "Remember me" keeps session for 30 days
- Logout clears all tokens

---

### 5.2 Match Result Calculation Logic

**Automatic Result Field:**
```typescript
function calculateResult(voltaScore: number, oppositionScore: number): 'Win' | 'Draw' | 'Loss' {
  if (voltaScore > oppositionScore) return 'Win';
  if (voltaScore === oppositionScore) return 'Draw';
  return 'Loss';
}
```

**Validation:**
- Result must match score difference
- Recalculated on any score edit
- Database trigger ensures consistency

---

### 5.3 Goalscorer Management

**Adding Goalscorers:**
1. Select player from dropdown
2. Enter goals scored (1-10 typically)
3. Add another player or save
4. Total must match Volta score

**Player Dropdown:**
- Shows all existing players alphabetically
- Search/filter by name
- "+ Add New Player" option at bottom
- Recently used players at top

**Validation:**
```typescript
// Total goals must match Volta score
const totalGoals = goalscorers.reduce((sum, gs) => sum + gs.goals, 0);
if (totalGoals !== voltaScore) {
  return "Total goals must equal Volta score";
}

// No duplicate players
const uniquePlayers = new Set(goalscorers.map(gs => gs.playerId));
if (uniquePlayers.size !== goalscorers.length) {
  return "Cannot add the same player twice";
}
```

**Edge Cases:**
- Volta scores 0: No goalscorers required
- Own goal: Not tracked (opposition goal increases)
- Multiple goals by one player: Single entry with count

---

### 5.4 Filtering & Search

**Match Table Filters:**

**Opposition Search:**
- Text input with debounce (300ms)
- Case-insensitive partial match
- Clears when empty

**Year Filter:**
- Dropdown populated from match dates
- "All Time" default option
- Years sorted descending

**Result Filter:**
- Chip-style buttons: All / Win / Draw / Loss
- Single selection
- Visual active state

**Filter Combination:**
- All filters work together (AND logic)
- URL params update: `?opposition=thunder&year=2024&result=win`
- Shareable filtered URLs
- Clear all filters button

**Implementation:**
```typescript
const filteredMatches = matches.filter(match => {
  if (oppositionFilter && !match.opposition_team.toLowerCase().includes(oppositionFilter.toLowerCase())) {
    return false;
  }
  if (yearFilter && new Date(match.match_date).getFullYear() !== yearFilter) {
    return false;
  }
  if (resultFilter && match.result !== resultFilter) {
    return false;
  }
  return true;
});
```

---

### 5.5 Analytics Calculations

**Streak Detection:**
```typescript
function calculateStreak(matches: Match[]): {
  currentStreak: number;
  streakType: 'wins' | 'draws' | 'losses' | 'unbeaten';
  longestWinStreak: number;
  longestUnbeatenStreak: number;
} {
  // Sort by date descending
  const sorted = matches.sort((a, b) => 
    new Date(b.match_date).getTime() - new Date(a.match_date).getTime()
  );
  
  // Calculate current streak
  let current = 0;
  let type = sorted[0]?.result.toLowerCase();
  for (const match of sorted) {
    if (match.result.toLowerCase() === type) {
      current++;
    } else {
      break;
    }
  }
  
  // Calculate longest streaks
  let longestWin = 0, longestUnbeaten = 0;
  let tempWin = 0, tempUnbeaten = 0;
  
  for (const match of sorted) {
    if (match.result === 'Win') {
      tempWin++;
      tempUnbeaten++;
      longestWin = Math.max(longestWin, tempWin);
      longestUnbeaten = Math.max(longestUnbeaten, tempUnbeaten);
    } else if (match.result === 'Draw') {
      tempWin = 0;
      tempUnbeaten++;
      longestUnbeaten = Math.max(longestUnbeaten, tempUnbeaten);
    } else {
      tempWin = 0;
      tempUnbeaten = 0;
    }
  }
  
  return {
    currentStreak: current,
    streakType: type,
    longestWinStreak: longestWin,
    longestUnbeatenStreak: longestUnbeaten
  };
}
```

**Head-to-Head Records:**
```typescript
function calculateHeadToHead(matches: Match[]) {
  const h2h = matches.reduce((acc, match) => {
    const opp = match.opposition_team;
    if (!acc[opp]) {
      acc[opp] = { matches: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 };
    }
    acc[opp].matches++;
    acc[opp].goalsFor += match.volta_score;
    acc[opp].goalsAgainst += match.opposition_score;
    
    if (match.result === 'Win') acc[opp].wins++;
    else if (match.result === 'Draw') acc[opp].draws++;
    else acc[opp].losses++;
    
    return acc;
  }, {} as Record<string, HeadToHeadRecord>);
  
  return Object.entries(h2h)
    .sort(([, a], [, b]) => b.matches - a.matches)
    .slice(0, 5);
}
```

---

## 6. User Flows

### Flow 1: Admin Adds Match Result

1. Admin logs in with email/password
2. Dashboard shows "Add Match" button (prominent)
3. Taps "Add Match"
4. Form displays:
   - Date picker (defaults to today)
   - Opposition team text input
   - Volta score number input
   - Opposition score number input
5. Enters: "Thunder FC", Volta 5, Opposition 2
6. System shows "Add Goalscorers (5 goals needed)"
7. Selects "John Doe" from dropdown, enters 2 goals
8. Selects "Jane Smith", enters 2 goals
9. Selects "Mike Wilson", enters 1 goal
10. Total shows 5/5 goals ✓
11. Taps "Save Match"
12. Validation passes, match saved
13. Result auto-calculated: WIN
14. Redirected to match list, new match appears at top
15. Total time: ~25 seconds

### Flow 2: Public Views Match History

1. User opens volta-ft.vercel.app
2. Lands on Matches page
3. Sees table of all matches, newest first
4. Wants to see only wins against "Thunder FC"
5. Types "thunder" in opposition filter
6. Clicks "Win" result filter
7. Table updates to show 3 matches
8. Clicks on first match date
9. Modal/page shows full match details:
   - Date, opposition, score
   - Goalscorers breakdown
   - Match stats
10. Closes modal, returns to filtered view
11. Shares URL with friend (filters preserved)

### Flow 3: Public Checks Team Analytics

1. User navigates to "Analytics" tab
2. Dashboard loads with default "All Time" view
3. Sees overview cards: 24 matches, 14W-3D-7L, 58.3% win rate
4. Scrolls down to "Longest Winning Streak: 5 matches"
5. Views pie chart: Win/Draw/Loss distribution
6. Checks "Current Form": W W L D W
7. Scrolls to "Head-to-Head Records"
8. Sees Volta has played Thunder FC 4 times: 3W-1D-0L
9. Changes year filter to "2024"
10. All stats recalculate for 2024 only
11. Compares 2024 (62% win rate) vs All Time (58%)
12. Shares analytics page with team

### Flow 4: Admin Manages Player List

1. Admin logs in
2. Navigates to "Players" page
3. Sees list of all players with stats:
   - John Doe: 12 goals, 8 matches
   - Jane Smith: 10 goals, 10 matches
4. New player "Alex Brown" joining team
5. Clicks "Add Player"
6. Enters "Alex Brown"
7. Saves player (0 goals, 0 matches initially)
8. Later, when logging match with Alex's first goal:
   - Alex now appears in goalscorer dropdown
   - After saving match, Alex's stats update: 1 goal, 1 match

---

## 7. Free Tier Services & Limits

### 7.1 Vercel / Netlify
- **Limit:** Unlimited personal projects
- **Features:** HTTPS, automatic deployments, preview URLs
- **Cost:** $0

### 7.2 Supabase
- **Database:** 500MB (sufficient for ~50,000 match records)
- **Authentication:** Unlimited users (but you have 2)
- **API Requests:** 500,000/month
- **Bandwidth:** 5GB/month
- **Cost:** $0

**Usage Estimate:**
- 1 match + goalscorers: ~1KB
- 100 matches/year: 100KB
- 10 years: 1MB
- You'll never hit limits

### 7.3 Vercel/Netlify Free Tier Comparison

**Vercel:**
- 100GB bandwidth/month
- Fast global CDN
- Serverless functions (if needed)

**Netlify:**
- 100GB bandwidth/month
- Similar performance
- Slightly easier deployment

**Recommendation:** Either works perfectly. Choose based on preference.

---

## 8. Implementation Phases

### Phase 1: Core Setup & Authentication (Days 1-2)

**Goal:** Project structure, authentication working

**Tasks:**
- Initialize Vite + React + TypeScript project
- Install dependencies (Tailwind, shadcn, React Query, etc.)
- Configure Supabase project
- Create database schema
- Set up authentication flow
- Create admin users in Supabase directly
- Deploy basic app to Vercel/Netlify

**Success Criteria:**
- App loads successfully
- Admins can log in
- Public can view (empty) pages
- Database schema created

### Phase 2: Match Management (Days 3-5)

**Goal:** Add, edit, view matches

**Features:**
- Add match form with validation
- Match list table with filters
- Edit match functionality
- Delete match with confirmation
- Result auto-calculation
- Responsive table/card views

**Success Criteria:**
- Can add match in under 30 seconds
- Filters work correctly
- Mobile-friendly interface
- Data persists correctly

### Phase 3: Player & Goalscorer Management (Days 6-7)

**Goal:** Track players and goals

**Features:**
- Player list page
- Add player functionality
- Goalscorer selection in match form
- Validation (total goals match score)
- Player statistics display

**Success Criteria:**
- Can add new players easily
- Goalscorer selection is intuitive
- Validation prevents errors
- Player stats calculate correctly

### Phase 4: Analytics Dashboard (Days 8-10)

**Goal:** Display meaningful statistics

**Features:**
- Overview statistics cards
- Streak calculations
- Head-to-head records
- Year filter for analytics
- Basic charts (pie, bar)
- Goal statistics

**Success Criteria:**
- All stats calculate correctly
- Charts display properly
- Year filter works
- Handles edge cases (0-1 matches)

### Phase 5: Polish & Optimization (Days 11-12)

**Goal:** Production-ready app

**Features:**
- Loading states and skeletons
- Error handling and messages
- Empty states for all pages
- Mobile gesture optimization
- Performance optimization
- Cross-browser testing
- Final design touches

**Success Criteria:**
- Smooth animations
- No console errors
- Fast load times
- Works on all devices
- Professional appearance

### Phase 6: Testing & Launch (Day 13-14)

**Goal:** Live production app

**Tasks:**
- Comprehensive testing
- Add seed data for demo
- Documentation for admins
- Set up custom domain (optional)
- Final deployment
- Share with team

**Success Criteria:**
- Zero critical bugs
- All features working
- Admins can use without help
- Public URL accessible

**Total Timeline:** 2 weeks (part-time) or 1 week (full-time)

---

## 9. Success Metrics

### Usage Metrics (After 3 months)
- Match data entered weekly (avg 4-6 matches/month)
- Analytics viewed regularly by team
- Public page visits (if shared)
- Zero admin complaints about usability

### Performance Metrics
- Page load time: < 2 seconds
- Match entry: < 30 seconds
- Table filtering: Instant
- Mobile Lighthouse score: 90+

### Data Quality
- Zero data loss
- Accurate calculations
- No duplicate entries
- Consistent result values

### User Satisfaction
- Admins use regularly without friction
- Team checks stats frequently
- Positive feedback from viewers
- Feature requests indicate engagement

---

## 10. Constraints & Assumptions

### Constraints
- Must remain free to operate
- Mobile-first for admin data entry
- No authentication beyond 2 admins
- Public read access required
- Cannot exceed Supabase free tier

### Assumptions
- Admins have smartphones
- Internet available for data entry
- Matches occur regularly (1+ per week)
- Team composition relatively stable
- English language only
- Malaysian timezone (UTC+8)

---

## 11. Out of Scope

**Explicitly NOT included:**
- Player photos or avatars
- Match highlights or media
- Live score updates
- Mobile push notifications
- SMS alerts
- Social media integration
- Multiple teams or leagues
- Season management system
- Training session tracking
- Player attendance
- Financial/budget tracking
- Merchandise management
- Fan engagement features
- Comments or discussions
- Match predictions
- Opponent database
- Venue/location tracking
- Weather conditions
- Referee tracking
- Match ratings or reviews
- Export to other formats (add later if needed)

---

## 12. Future Considerations

**Only if needed after launch:**
- CSV export for match history
- Print-friendly match reports
- Season-based filtering
- Player injury tracking
- Match location/venue field
- Competition type (league, cup, friendly)
- Match notes field
- Email notifications for admins
- Public player profiles
- Advanced charts (heatmaps, trends)

**Do not add unless:**
- Current features insufficient
- Clear user request
- Doesn't add complexity
- Still within free tier

---

## 13. Technical Considerations

### 13.1 TypeScript Usage
All components and functions should be fully typed:

```typescript
// Types
interface Match {
  id: string;
  match_date: string;
  opposition_team: string;
  volta_score: number;
  opposition_score: number;
  result: 'Win' | 'Draw' | 'Loss';
  created_at: string;
  updated_at: string;
}

interface Player {
  id: string;
  name: string;
  created_at: string;
}

interface MatchGoal {
  id: string;
  match_id: string;
  player_id: string;
  goals_count: number;
  player?: Player;
}

interface PlayerStats {
  id: string;
  name: string;
  total_goals: number;
  matches_played: number;
  goals_per_match: number;
}
```

### 13.2 React Query Setup
```typescript
// queries/matches.ts
export const useMatches = (filters: MatchFilters) => {
  return useQuery({
    queryKey: ['matches', filters],
    queryFn: () => fetchMatches(filters),
  });
};

export const useAddMatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
};
```

### 13.3 Supabase Row Level Security

```sql
-- Public read access
CREATE POLICY "Public read access" ON matches
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON players
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON match_goals
  FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Authenticated users can insert" ON matches
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON matches
  FOR UPDATE USING (auth.role() = 'authenticate