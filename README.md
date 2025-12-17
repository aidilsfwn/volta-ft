# Volta FT

Futsal team match tracking and analytics dashboard.

## Features
- Match result tracking
- Player goalscorer statistics
- Interactive match history with filtering
- Analytics dashboard with performance metrics
- Mobile-first admin interface
- Public viewing for team and supporters

## Tech Stack
- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** React Query (TanStack Query)
- **Database & Auth:** Supabase (PostgreSQL)
- **Charts:** Recharts
- **Hosting:**  Netlify

## Setup

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account
- Netlify account

### Installation

1. Clone the repository
```bash
   git clone https://github.com/yourusername/volta-ft.git
   cd volta-ft
```

2. Install dependencies
```bash
   npm install
```

3. Set up environment variables
```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
```

4. Run development server
```bash
   npm run dev
```

5. Open http://localhost:5173

### Deployment

**Vercel:**
```bash
vercel
```

**Netlify:**
```bash
netlify deploy --prod
```

## Admin Access
- Two admin accounts pre-configured in Supabase
- Login required for adding/editing matches
- Public viewing requires no authentication

## Database Schema
- `players` - Team player roster
- `matches` - Match results
- `match_goals` - Goalscorer records per match

## Project Structure
See `PROJECT_STRUCTURE.md` for detailed file organization.

## License
Private project - All rights reserved.