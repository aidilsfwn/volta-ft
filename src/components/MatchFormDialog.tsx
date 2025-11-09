import { useEffect, useState, type FormEvent } from "react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import type { Match } from "@/types";

export const MatchFormDialog = ({
  open,
  onOpenChange,
  match,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match?: Match;
  onSave: (match: Match) => void;
}) => {
  const [formData, setFormData] = useState<Match>(
    match || {
      id: "",
      date: "",
      opponent: "",
      score: "",
      result: "W",
      scorers: "",
    }
  );

  useEffect(() => {
    if (match) {
      setFormData(match);
    } else {
      setFormData({
        id: "",
        date: "",
        opponent: "",
        score: "",
        result: "W",
        scorers: "",
      });
    }
  }, [match, open]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || Date.now().toString(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{match ? "Edit Match" : "Add New Match"}</DialogTitle>
          <DialogDescription>
            {match
              ? "Update match details below."
              : "Enter match details below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="opponent">Opponent</Label>
              <Input
                id="opponent"
                value={formData.opponent}
                onChange={(e) =>
                  setFormData({ ...formData, opponent: e.target.value })
                }
                placeholder="e.g., Berserker"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                value={formData.score}
                onChange={(e) =>
                  setFormData({ ...formData, score: e.target.value })
                }
                placeholder="e.g., 11-4"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="result">Result</Label>
              <Select
                value={formData.result}
                onValueChange={(value: "W" | "D" | "L") =>
                  setFormData({ ...formData, result: value })
                }
              >
                <SelectTrigger id="result">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="W">Win (W)</SelectItem>
                  <SelectItem value="D">Draw (D)</SelectItem>
                  <SelectItem value="L">Loss (L)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="scorers">Scorers</Label>
              <Input
                id="scorers"
                value={formData.scorers}
                onChange={(e) =>
                  setFormData({ ...formData, scorers: e.target.value })
                }
                placeholder="e.g., Adlan (4), Farid (2)"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {match ? "Save Changes" : "Add Match"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
