import type { Database } from './database.types';

// Database table types
export type Match = Database['public']['Tables']['matches']['Row'];
export type MatchInsert = Database['public']['Tables']['matches']['Insert'];
export type MatchUpdate = Database['public']['Tables']['matches']['Update'];

export type Player = Database['public']['Tables']['players']['Row'];
export type PlayerInsert = Database['public']['Tables']['players']['Insert'];
export type PlayerUpdate = Database['public']['Tables']['players']['Update'];

export type MatchGoal = Database['public']['Tables']['match_goals']['Row'];
export type MatchGoalInsert = Database['public']['Tables']['match_goals']['Insert'];
export type MatchGoalUpdate = Database['public']['Tables']['match_goals']['Update'];

export type PlayerStats = Database['public']['Views']['player_stats']['Row'];

// Extended types with relationships
export type MatchGoalWithPlayer = MatchGoal & {
  player: Player;
};

export type MatchWithGoals = Match & {
  match_goals: MatchGoalWithPlayer[];
};

// Form types
export type GoalscorerInput = {
  player_id: string;
  player_name?: string;
  goals_count: number;
};

export type MatchFormData = {
  match_date: string;
  opposition_team: string;
  volta_score: number;
  opposition_score: number;
  goalscorers: GoalscorerInput[];
};

// Re-export form validation types
export type { MatchFormValues, PlayerFormValues } from '@/lib/validations';

// Filter types
export type MatchFilters = {
  opposition?: string;
  year?: number;
  result?: 'Win' | 'Draw' | 'Loss';
};
