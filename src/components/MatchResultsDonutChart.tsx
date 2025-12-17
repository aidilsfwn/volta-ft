import { useMemo, useState } from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import { initialMatches } from "@/constants";
import type { ChartConfig } from "@/components/ui/chart";

const chartConfig = {
  matches: {
    label: "Matches",
  },
  wins: {
    label: "Wins",
    color: "#22c55e",
  },
  draws: {
    label: "Draws",
    color: "#eab308",
  },
  losses: {
    label: "Losses",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export const MatchResultsDonutChart = () => {
  const availableYears = useMemo(() => {
    const years = initialMatches.map((match) =>
      new Date(match.match_date).getFullYear()
    );
    return ["all", ...Array.from(new Set(years)).sort((a, b) => b - a)];
  }, []);

  const [selectedYear, setSelectedYear] = useState<string>("all");

  const filteredMatches = useMemo(() => {
    if (selectedYear === "all") return initialMatches;

    return initialMatches.filter(
      (match) => new Date(match.match_date).getFullYear() === parseInt(selectedYear)
    );
  }, [selectedYear]);

  const chartData = useMemo(() => {
    const results = filteredMatches.reduce((acc, match) => {
      acc[match.result] = (acc[match.result] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { result: "wins", matches: results.Win || 0, fill: "var(--color-wins)" },
      { result: "draws", matches: results.Draw || 0, fill: "var(--color-draws)" },
      {
        result: "losses",
        matches: results.Loss || 0,
        fill: "var(--color-losses)",
      },
    ];
  }, [filteredMatches]);

  const totalMatches = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.matches, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row justify-between items-center pb-0">
        <CardTitle>Match Results</CardTitle>
        <div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year === "all" ? "All Time" : year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="matches"
              nameKey="result"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalMatches.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Matches
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
