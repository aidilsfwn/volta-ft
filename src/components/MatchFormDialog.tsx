import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
} from '@/components';
import { GoalscorerInputComponent } from './GoalscorerInput';
import { matchFormSchema, type MatchFormValues } from '@/lib/validations';
import { calculateResult } from '@/lib/calculations';
import type { MatchWithGoals, GoalscorerInput } from '@/types';

interface MatchFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match?: MatchWithGoals;
  onSave: (data: MatchFormValues) => void;
  isLoading?: boolean;
}

export const MatchFormDialog = ({
  open,
  onOpenChange,
  match,
  onSave,
  isLoading = false,
}: MatchFormDialogProps) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<MatchFormValues>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      match_date: '',
      opposition_team: '',
      volta_score: 0,
      opposition_score: 0,
      goalscorers: [],
    },
  });

  // Watch scores to auto-update goalscorers requirement
  const voltaScore = watch('volta_score');
  const oppositionScore = watch('opposition_score');
  const goalscorers = watch('goalscorers');

  // Reset form when dialog opens/closes or match changes
  useEffect(() => {
    if (open) {
      if (match) {
        // Editing existing match
        const formattedGoalscorers: GoalscorerInput[] = match.match_goals.map((mg) => ({
          player_id: mg.player_id,
          player_name: mg.player.name,
          goals_count: mg.goals_count,
        }));

        reset({
          match_date: match.match_date,
          opposition_team: match.opposition_team,
          volta_score: match.volta_score,
          opposition_score: match.opposition_score,
          goalscorers: formattedGoalscorers,
        });
      } else {
        // Adding new match
        const today = new Date().toISOString().split('T')[0];
        reset({
          match_date: today,
          opposition_team: '',
          volta_score: 0,
          opposition_score: 0,
          goalscorers: [],
        });
      }
    }
  }, [open, match, reset]);

  // Auto-clear goalscorers if volta score becomes 0
  useEffect(() => {
    if (voltaScore === 0 && goalscorers.length > 0) {
      setValue('goalscorers', []);
    }
  }, [voltaScore, goalscorers.length, setValue]);

  const onSubmit = (data: MatchFormValues) => {
    onSave(data);
    // Don't close immediately - let parent handle it after mutation succeeds
  };

  // Calculate result for display
  const result = voltaScore !== undefined && oppositionScore !== undefined
    ? calculateResult(voltaScore, oppositionScore)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{match ? 'Edit Match' : 'Add New Match'}</DialogTitle>
          <DialogDescription>
            {match
              ? 'Update match details below.'
              : 'Enter match details below. Result will be calculated automatically.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Date */}
            <div className="grid gap-2">
              <Label htmlFor="match_date">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="match_date"
                type="date"
                {...register('match_date')}
                className={errors.match_date ? 'border-red-500' : ''}
              />
              {errors.match_date && (
                <p className="text-sm text-red-600">{errors.match_date.message}</p>
              )}
            </div>

            {/* Opposition Team */}
            <div className="grid gap-2">
              <Label htmlFor="opposition_team">
                Opposition Team <span className="text-red-500">*</span>
              </Label>
              <Input
                id="opposition_team"
                {...register('opposition_team')}
                placeholder="e.g., Thunder FC"
                className={errors.opposition_team ? 'border-red-500' : ''}
              />
              {errors.opposition_team && (
                <p className="text-sm text-red-600">{errors.opposition_team.message}</p>
              )}
            </div>

            {/* Scores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="volta_score">
                  Volta FT Score <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="volta_score"
                  type="number"
                  min="0"
                  {...register('volta_score', { valueAsNumber: true })}
                  className={errors.volta_score ? 'border-red-500' : ''}
                />
                {errors.volta_score && (
                  <p className="text-sm text-red-600">{errors.volta_score.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="opposition_score">
                  Opposition Score <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="opposition_score"
                  type="number"
                  min="0"
                  {...register('opposition_score', { valueAsNumber: true })}
                  className={errors.opposition_score ? 'border-red-500' : ''}
                />
                {errors.opposition_score && (
                  <p className="text-sm text-red-600">{errors.opposition_score.message}</p>
                )}
              </div>
            </div>

            {/* Result Preview */}
            {result && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">
                  Result:{' '}
                  <span
                    className={
                      result === 'Win'
                        ? 'text-green-600'
                        : result === 'Draw'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }
                  >
                    {result}
                  </span>
                </p>
              </div>
            )}

            {/* Goalscorers */}
            <Controller
              name="goalscorers"
              control={control}
              render={({ field }) => (
                <GoalscorerInputComponent
                  goalscorers={field.value}
                  onChange={field.onChange}
                  requiredTotal={voltaScore || 0}
                  error={errors.goalscorers?.message}
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : match ? 'Save Changes' : 'Add Match'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
