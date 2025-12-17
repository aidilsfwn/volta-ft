import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getYearsFromMatches } from '@/lib/calculations';
import type { MatchFilters, Match } from '@/types';

interface MatchFiltersProps {
  matches: Match[];
  filters: MatchFilters;
  onFiltersChange: (filters: MatchFilters) => void;
}

export const MatchFiltersComponent = ({
  matches,
  filters,
  onFiltersChange,
}: MatchFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [oppositionSearch, setOppositionSearch] = useState(filters.opposition || '');

  const years = getYearsFromMatches(matches);
  const hasActiveFilters = filters.opposition || filters.year || filters.result;

  const updateFilter = (key: keyof MatchFilters, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    
    // Remove undefined values
    Object.keys(newFilters).forEach((k) => {
      if (newFilters[k as keyof MatchFilters] === undefined) {
        delete newFilters[k as keyof MatchFilters];
      }
    });

    onFiltersChange(newFilters);

    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value.toString());
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setOppositionSearch('');
    onFiltersChange({});
    setSearchParams(new URLSearchParams());
  };

  const handleOppositionSearch = (value: string) => {
    setOppositionSearch(value);
    // Debounce the filter update
    const timer = setTimeout(() => {
      updateFilter('opposition', value || undefined);
    }, 300);
    return () => clearTimeout(timer);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Opposition Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opposition..."
            value={oppositionSearch}
            onChange={(e) => handleOppositionSearch(e.target.value)}
            className="pl-9"
          />
          {oppositionSearch && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => {
                setOppositionSearch('');
                updateFilter('opposition', undefined);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Year Filter */}
        <Select
          value={filters.year?.toString() || 'all'}
          onValueChange={(value) =>
            updateFilter('year', value === 'all' ? undefined : parseInt(value))
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Result Filter Chips */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">Result:</span>
        <Button
          variant={!filters.result ? 'default' : 'outline'}
          size="sm"
          onClick={() => updateFilter('result', undefined)}
        >
          All
        </Button>
        <Button
          variant={filters.result === 'Win' ? 'default' : 'outline'}
          size="sm"
          onClick={() => updateFilter('result', 'Win')}
          className={
            filters.result === 'Win'
              ? 'bg-green-600 hover:bg-green-700'
              : 'hover:bg-green-50'
          }
        >
          Win
        </Button>
        <Button
          variant={filters.result === 'Draw' ? 'default' : 'outline'}
          size="sm"
          onClick={() => updateFilter('result', 'Draw')}
          className={
            filters.result === 'Draw'
              ? 'bg-yellow-600 hover:bg-yellow-700'
              : 'hover:bg-yellow-50'
          }
        >
          Draw
        </Button>
        <Button
          variant={filters.result === 'Loss' ? 'default' : 'outline'}
          size="sm"
          onClick={() => updateFilter('result', 'Loss')}
          className={
            filters.result === 'Loss'
              ? 'bg-red-600 hover:bg-red-700'
              : 'hover:bg-red-50'
          }
        >
          Loss
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="ml-auto"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.opposition && (
            <Badge variant="secondary">
              Opposition: {filters.opposition}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => {
                  setOppositionSearch('');
                  updateFilter('opposition', undefined);
                }}
              />
            </Badge>
          )}
          {filters.year && (
            <Badge variant="secondary">
              Year: {filters.year}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => updateFilter('year', undefined)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
