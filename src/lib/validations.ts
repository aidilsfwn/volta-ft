import { z } from 'zod';

/**
 * Match form validation schema
 */
export const matchFormSchema = z.object({
  match_date: z.string()
    .min(1, 'Date is required')
    .refine((date) => {
      const matchDate = new Date(date);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return matchDate <= today;
    }, 'Date cannot be in the future'),
  
  opposition_team: z.string()
    .min(1, 'Opposition team is required')
    .max(100, 'Team name too long'),
  
  volta_score: z.number()
    .int('Score must be a whole number')
    .min(0, 'Score cannot be negative'),
  
  opposition_score: z.number()
    .int('Score must be a whole number')
    .min(0, 'Score cannot be negative'),
  
  goalscorers: z.array(z.object({
    player_id: z.string().min(1, 'Player is required'),
    player_name: z.string().optional(),
    goals_count: z.number()
      .int('Goals must be a whole number')
      .min(1, 'Goals must be at least 1')
      .max(20, 'Goals cannot exceed 20'),
  })).refine((goalscorers) => {
    // Check for duplicate players
    const playerIds = goalscorers.map(g => g.player_id);
    return playerIds.length === new Set(playerIds).size;
  }, {
    message: 'Cannot add the same player twice',
  }),
}).refine((data) => {
  // Validate total goals match Volta score
  if (data.volta_score === 0) {
    return data.goalscorers.length === 0;
  }
  
  const totalGoals = data.goalscorers.reduce((sum, gs) => sum + gs.goals_count, 0);
  return totalGoals === data.volta_score;
}, {
  message: 'Total goals must equal Volta FT score',
  path: ['goalscorers'],
});

export type MatchFormValues = z.infer<typeof matchFormSchema>;

/**
 * Player form validation schema
 */
export const playerFormSchema = z.object({
  name: z.string()
    .min(1, 'Player name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
});

export type PlayerFormValues = z.infer<typeof playerFormSchema>;
