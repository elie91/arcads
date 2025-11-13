import type {
  Transaction,
  CreateTransactionDto,
  HighestMarginReport,
  WeeklyAverageMarginReport,
  CityPerformanceReport,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Transactions API
export const transactionsApi = {
  getAll: () => fetchApi<Transaction[]>("/transactions"),

  getById: (id: string) => fetchApi<Transaction>(`/transactions/${id}`),

  create: (data: CreateTransactionDto) =>
    fetchApi<Transaction>("/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Reports API
export const reportsApi = {
  getHighestMargin: () =>
    fetchApi<HighestMarginReport>("/reports/highest-margin"),

  getWeeklyAverageMargin: () =>
    fetchApi<WeeklyAverageMarginReport>("/reports/weekly-average-margin"),

  getCityPerformance: () =>
    fetchApi<CityPerformanceReport>("/reports/city-performance"),
};
