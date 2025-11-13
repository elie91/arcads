import { CityPerformanceCard } from "@/components/reports/city-performance-card";
import { HighestMarginCard } from "@/components/reports/highest-margin-card";
import { WeeklyAverageCard } from "@/components/reports/weekly-average-card";

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of real estate performance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklyAverageCard />
        </div>
        <div>
          <HighestMarginCard />
        </div>
      </div>

      <div>
        <CityPerformanceCard />
      </div>
    </div>
  );
}
