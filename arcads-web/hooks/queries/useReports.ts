import { useQuery } from "@tanstack/react-query";

import { reportsApi } from "@/lib/api";

// Query keys
export const reportKeys = {
  all: ["reports"] as const,
  highestMargin: () => [...reportKeys.all, "highest-margin"] as const,
  weeklyAverage: () => [...reportKeys.all, "weekly-average"] as const,
  cityPerformance: () => [...reportKeys.all, "city-performance"] as const,
};

// Get highest margin report
export function useHighestMarginReport() {
  return useQuery({
    queryKey: reportKeys.highestMargin(),
    queryFn: reportsApi.getHighestMargin,
  });
}

// Get weekly average margin report
export function useWeeklyAverageMarginReport() {
  return useQuery({
    queryKey: reportKeys.weeklyAverage(),
    queryFn: reportsApi.getWeeklyAverageMargin,
  });
}

// Get city performance report
export function useCityPerformanceReport() {
  return useQuery({
    queryKey: reportKeys.cityPerformance(),
    queryFn: reportsApi.getCityPerformance,
  });
}
