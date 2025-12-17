import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Player, PlayerStats } from '@/types';

/**
 * Fetch all players
 */
export function usePlayers() {
  return useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Player[];
    },
  });
}

/**
 * Fetch player statistics from view
 */
export function usePlayerStats() {
  return useQuery({
    queryKey: ['player-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .order('total_goals', { ascending: false });

      if (error) throw error;
      return data as PlayerStats[];
    },
  });
}

/**
 * Add new player
 */
export function useAddPlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('players')
        .insert({ name })
        .select()
        .single();

      if (error) throw error;
      return data as Player;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['player-stats'] });
    },
  });
}

/**
 * Update player name
 */
export function useUpdatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; name: string }) => {
      const { error } = await supabase
        .from('players')
        .update({ name: data.name })
        .eq('id', data.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['player-stats'] });
    },
  });
}

/**
 * Check if player name already exists (case-insensitive)
 */
export async function checkPlayerNameExists(name: string, excludeId?: string): Promise<boolean> {
  let query = supabase
    .from('players')
    .select('id')
    .ilike('name', name);

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data.length > 0;
}
