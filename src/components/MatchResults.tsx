import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpDown, Plus, Pencil, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Badge, Button, DataTable, MatchFormDialog } from '@/components';
import { MatchFiltersComponent } from './MatchFilters';
import { useMatches, useAddMatch, useUpdateMatch, useDeleteMatch } from '@/hooks/useMatches';
import { formatMatchDate, formatScore, formatGoalscorers } from '@/lib/calculations';
import type { MatchWithGoals, MatchFilters, MatchFormValues } from '@/types';

export const MatchResults = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<MatchFilters>({
    opposition: searchParams.get('opposition') || undefined,
    year: searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined,
    result: (searchParams.get('result') as 'Win' | 'Draw' | 'Loss') || undefined,
  });

  const { data: matches = [], isLoading, error } = useMatches(filters);
  const addMatchMutation = useAddMatch();
  const updateMatchMutation = useUpdateMatch();
  const deleteMatchMutation = useDeleteMatch();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<MatchWithGoals | undefined>();

  // Sync filters with URL params on mount
  useEffect(() => {
    const opposition = searchParams.get('opposition');
    const year = searchParams.get('year');
    const result = searchParams.get('result');

    setFilters({
      opposition: opposition || undefined,
      year: year ? parseInt(year) : undefined,
      result: (result as 'Win' | 'Draw' | 'Loss') || undefined,
    });
  }, [searchParams]);

  const handleAddMatch = () => {
    setEditingMatch(undefined);
    setDialogOpen(true);
  };

  const handleEditMatch = (match: MatchWithGoals) => {
    setEditingMatch(match);
    setDialogOpen(true);
  };

  const handleDeleteMatch = (id: string) => {
    if (confirm('Are you sure you want to delete this match?')) {
      deleteMatchMutation.mutate(id);
    }
  };

  const handleSaveMatch = (data: MatchFormValues) => {
    console.log('Saving match with data:', data);
    
    if (editingMatch) {
      // Update existing match
      updateMatchMutation.mutate(
        {
          id: editingMatch.id,
          ...data,
        },
        {
          onSuccess: () => {
            console.log('Match updated successfully');
            setDialogOpen(false);
            setEditingMatch(undefined);
          },
          onError: (error) => {
            console.error('Error updating match:', error);
            alert(`Error updating match: ${error.message}`);
          },
        }
      );
    } else {
      // Add new match
      addMatchMutation.mutate(data, {
        onSuccess: () => {
          console.log('Match added successfully');
          setDialogOpen(false);
        },
        onError: (error) => {
          console.error('Error adding match:', error);
          alert(`Error adding match: ${error.message}`);
        },
      });
    }
  };

  const columns: ColumnDef<MatchWithGoals>[] = [
    {
      accessorKey: 'match_date',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div>{formatMatchDate(row.getValue('match_date'))}</div>;
      },
    },
    {
      accessorKey: 'opposition_team',
      header: 'Opponent',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('opposition_team')}</div>
      ),
    },
    {
      id: 'score',
      header: () => <div className="text-center">Score</div>,
      cell: ({ row }) => (
        <div className="text-center font-bold">
          {formatScore(row.original.volta_score, row.original.opposition_score)}
        </div>
      ),
    },
    {
      accessorKey: 'result',
      header: () => <div className="text-center">Result</div>,
      cell: ({ row }) => {
        const result = row.getValue('result') as string;
        const variant =
          result === 'Win'
            ? 'default'
            : result === 'Draw'
            ? 'secondary'
            : 'destructive';
        const color =
          result === 'Win'
            ? 'bg-green-500 hover:bg-green-600'
            : result === 'Draw'
            ? 'bg-yellow-500 hover:bg-yellow-600'
            : '';

        return (
          <div className="flex justify-center">
            <Badge variant={variant} className={color}>
              {result}
            </Badge>
          </div>
        );
      },
    },
    {
      id: 'scorers',
      header: 'Scorers',
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-md">
          {formatGoalscorers(row.original.match_goals)}
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const match = row.original;
        return (
          <div className="flex justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditMatch(match)}
              className="h-8 w-8 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteMatch(match.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="py-10">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading matches: {(error as Error).message}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">Match Results</div>
          <p className="text-sm text-muted-foreground mt-1">
            {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
          </p>
        </div>
        <Button variant="secondary" onClick={handleAddMatch}>
          <Plus />
          <span className="hidden sm:inline">Add Match</span>
        </Button>
      </div>

      <div className="mb-6">
        <MatchFiltersComponent
          matches={matches}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Loading matches...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">
            {Object.keys(filters).length > 0
              ? 'No matches match your filters. Try adjusting them.'
              : 'No matches found. Add your first match!'}
          </p>
          {Object.keys(filters).length === 0 && (
            <Button onClick={handleAddMatch}>
              <Plus className="mr-2" />
              Add First Match
            </Button>
          )}
        </div>
      ) : (
        <DataTable columns={columns} data={matches} />
      )}

      <MatchFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        match={editingMatch}
        onSave={handleSaveMatch}
        isLoading={addMatchMutation.isPending || updateMatchMutation.isPending}
      />
    </div>
  );
};
