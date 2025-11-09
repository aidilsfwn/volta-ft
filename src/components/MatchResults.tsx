import { useState } from "react";
import { ArrowUpDown, Plus, Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge, Button, DataTable, MatchFormDialog } from "@/components";
import { initialMatches } from "@/constants";
import type { Match } from "@/types";

export const MatchResults = () => {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | undefined>();

  const handleAddMatch = () => {
    setEditingMatch(undefined);
    setDialogOpen(true);
  };

  const handleEditMatch = (match: Match) => {
    setEditingMatch(match);
    setDialogOpen(true);
  };

  const handleDeleteMatch = (id: string) => {
    if (confirm("Are you sure you want to delete this match?")) {
      setMatches(matches.filter((m) => m.id !== id));
    }
  };

  const handleSaveMatch = (match: Match) => {
    if (editingMatch) {
      setMatches(matches.map((m) => (m.id === match.id ? match : m)));
    } else {
      setMatches([...matches, match]);
    }
  };

  const columns: ColumnDef<Match>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return (
          <div>
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (!value) return true;
        const date = new Date(row.getValue(id));
        return date.getFullYear().toString() === value;
      },
    },
    {
      accessorKey: "opponent",
      header: "Opponent",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("opponent")}</div>
      ),
    },
    {
      accessorKey: "score",
      header: () => <div className="text-center">Score</div>,
      cell: ({ row }) => (
        <div className="text-center font-bold">{row.getValue("score")}</div>
      ),
    },
    {
      accessorKey: "result",
      header: () => <div className="text-center">Result</div>,
      cell: ({ row }) => {
        const result = row.getValue("result") as string;
        const variant =
          result === "W"
            ? "default"
            : result === "D"
            ? "secondary"
            : "destructive";
        const color =
          result === "W"
            ? "bg-green-500 hover:bg-green-600"
            : result === "D"
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "";

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
      accessorKey: "scorers",
      header: "Scorers",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-md">
          {row.getValue("scorers")}
        </div>
      ),
    },
    {
      id: "actions",
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

  return (
    <div className="py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">Match Results</div>
        </div>
        <Button variant={"secondary"} onClick={handleAddMatch}>
          <Plus />
          <span className="hidden sm:inline">Add Match</span>
        </Button>
      </div>

      <DataTable columns={columns} data={matches} />

      <MatchFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        match={editingMatch}
        onSave={handleSaveMatch}
      />
    </div>
  );
};
