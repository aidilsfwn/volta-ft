import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { calculateResult } from '@/lib/calculations';
import type { 
  MatchWithGoals, 
  MatchFilters,
  GoalscorerInput,
} from '@/types';

/**
 * Fetch all matches with optional filters
 */
export function useMatches(filters?: MatchFilters) {
  return useQuery({
    queryKey: ['matches', filters],
    queryFn: async () => {
      let query = supabase
        .from('matches')
        .select(`
          *,
          match_goals (
            *,
            player:players (*)
          )
        `)
        .order('match_date', { ascending: false });

      // Apply filters
      if (filters?.opposition) {
        query = query.ilike('opposition_team', `%${filters.opposition}%`);
      }

      if (filters?.year) {
        const startDate = `${filters.year}-01-01`;
        const endDate = `${filters.year}-12-31`;
        query = query.gte('match_date', startDate).lte('match_date', endDate);
      }

      if (filters?.result) {
        query = query.eq('result', filters.result);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as MatchWithGoals[];
    },
  });
}

/**
 * Fetch single match by ID
 */
export function useMatchById(id: string) {
  return useQuery({
    queryKey: ['match', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          match_goals (
            *,
            player:players (*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as MatchWithGoals;
    },
    enabled: !!id,
  });
}

/**
 * Add new match with goalscorers
 */
export function useAddMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      match_date: string;
      opposition_team: string;
      volta_score: number;
      opposition_score: number;
      goalscorers: GoalscorerInput[];
    }) => {
      // Calculate result
      const result = calculateResult(data.volta_score, data.opposition_score);

      // Insert match
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .insert({
          match_date: data.match_date,
          opposition_team: data.opposition_team,
          volta_score: data.volta_score,
          opposition_score: data.opposition_score,
          result,
        })
        .select()
        .single();

      if (matchError) throw matchError;
      if (!match) throw new Error('Failed to create match');

      // Insert goalscorers if any
      if (data.goalscorers.length > 0) {
        const goalsInserts = data.goalscorers.map((gs) => ({
          match_id: match.id,
          player_id: gs.player_id,
          goals_count: gs.goals_count,
        }));

        const { error: goalsError } = await supabase
          .from('match_goals')
          .insert(goalsInserts);

        if (goalsError) throw goalsError;
      }

      return match;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}

/**
 * Update existing match
 */
export function useUpdateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      match_date: string;
      opposition_team: string;
      volta_score: number;
      opposition_score: number;
      goalscorers: GoalscorerInput[];
    }) => {
      // Calculate result
      const result = calculateResult(data.volta_score, data.opposition_score);

      // Update match
      const { error: matchError } = await supabase
        .from('matches')
        .update({
          match_date: data.match_date,
          opposition_team: data.opposition_team,
          volta_score: data.volta_score,
          opposition_score: data.opposition_score,
          result,
          updated_at: new Date().toISOString(),
        })
        .eq('id', data.id);

      if (matchError) throw matchError;

      // Delete existing goalscorers
      const { error: deleteError } = await supabase
        .from('match_goals')
        .delete()
        .eq('match_id', data.id);

      if (deleteError) throw deleteError;

      // Insert new goalscorers if any
      if (data.goalscorers.length > 0) {
        const goalsInserts = data.goalscorers.map((gs) => ({
          match_id: data.id,
          player_id: gs.player_id,
          goals_count: gs.goals_count,
        }));

        const { error: goalsError } = await supabase
          .from('match_goals')
          .insert(goalsInserts);

        if (goalsError) throw goalsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}

/**
 * Delete match (cascades to match_goals)
 */
export function useDeleteMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}
