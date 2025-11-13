import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { transactionsApi } from "@/lib/api";
import type { CreateTransactionDto } from "@/types";

// Query keys
export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: () => [...transactionKeys.lists()] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};

// Get all transactions
export function useTransactions() {
  return useQuery({
    queryKey: transactionKeys.list(),
    queryFn: transactionsApi.getAll,
  });
}

// Get single transaction
export function useTransaction(id: string) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: () => transactionsApi.getById(id),
    enabled: !!id,
  });
}

// Create transaction
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionDto) => transactionsApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch transactions list
      void queryClient.invalidateQueries({ queryKey: transactionKeys.list() });
      // Also invalidate reports since they depend on transactions
      void queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}
