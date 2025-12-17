import { Plus, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePlayers } from '@/hooks/usePlayers';
import type { GoalscorerInput, Player } from '@/types';

interface GoalscorerInputProps {
  goalscorers: GoalscorerInput[];
  onChange: (goalscorers: GoalscorerInput[]) => void;
  requiredTotal: number;
  error?: string;
}

export const GoalscorerInputComponent = ({
  goalscorers,
  onChange,
  requiredTotal,
  error,
}: GoalscorerInputProps) => {
  const { data: players = [], isLoading } = usePlayers();

  const currentTotal = goalscorers.reduce((sum, gs) => sum + gs.goals_count, 0);

  const addGoalscorer = () => {
    onChange([
      ...goalscorers,
      { player_id: '', goals_count: 1 },
    ]);
  };

  const removeGoalscorer = (index: number) => {
    onChange(goalscorers.filter((_, i) => i !== index));
  };

  const updateGoalscorer = (index: number, field: keyof GoalscorerInput, value: string | number) => {
    const updated = [...goalscorers];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-semibold">Goalscorers</Label>
          {requiredTotal > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Total: <span className={currentTotal === requiredTotal ? 'text-green-600 font-semibold' : 'font-semibold'}>{currentTotal}</span> / {requiredTotal} goals
            </p>
          )}
        </div>
        {requiredTotal > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addGoalscorer}
            disabled={currentTotal >= requiredTotal}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Scorer
          </Button>
        )}
      </div>

      {requiredTotal === 0 ? (
        <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
          <p className="text-sm text-muted-foreground text-center">
            No goalscorers needed (Volta FT scored 0 goals)
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {goalscorers.map((scorer, index) => (
            <div 
              key={index} 
              className="p-4 bg-muted/30 rounded-lg border border-border"
            >
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Label htmlFor={`player-${index}`} className="text-sm font-medium block mb-2">
                    Player
                  </Label>
                  <Select
                    value={scorer.player_id}
                    onValueChange={(value) => {
                      const player = players.find((p: Player) => p.id === value);
                      const updated = [...goalscorers];
                      updated[index] = {
                        ...updated[index],
                        player_id: value,
                        player_name: player?.name,
                      };
                      onChange(updated);
                    }}
                  >
                    <SelectTrigger id={`player-${index}`} className="w-full">
                      <SelectValue placeholder="Select player" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading players...
                        </SelectItem>
                      ) : players.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          No players found
                        </SelectItem>
                      ) : (
                        players.map((player: Player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-24">
                  <Label htmlFor={`goals-${index}`} className="text-sm font-medium block mb-2">
                    Goals
                  </Label>
                  <Input
                    id={`goals-${index}`}
                    type="number"
                    min="1"
                    max="20"
                    value={scorer.goals_count}
                    onChange={(e) =>
                      updateGoalscorer(index, 'goals_count', parseInt(e.target.value) || 1)
                    }
                    className="text-center"
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeGoalscorer(index)}
                  className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {goalscorers.length === 0 && requiredTotal > 0 && (
            <div className="p-6 bg-muted/50 rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground text-center">
                Click "Add Scorer" to add goalscorers
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {currentTotal !== requiredTotal && requiredTotal > 0 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-700 flex-shrink-0" />
          <p className="text-sm text-amber-700 font-medium">
            {currentTotal < requiredTotal
              ? `Need ${requiredTotal - currentTotal} more goal${requiredTotal - currentTotal > 1 ? 's' : ''}`
              : `Remove ${currentTotal - requiredTotal} goal${currentTotal - requiredTotal > 1 ? 's' : ''}`}
          </p>
        </div>
      )}

      {currentTotal === requiredTotal && requiredTotal > 0 && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-700 flex-shrink-0" />
          <p className="text-sm text-green-700 font-medium">
            Total matches Volta FT score
          </p>
        </div>
      )}
    </div>
  );
};
