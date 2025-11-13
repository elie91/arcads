"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTransactions } from "@/hooks/queries/useTransactions";

export default function TransactionsPage() {
  const { data: transactions, isLoading, error } = useTransactions();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">List of all transactions</p>
          </div>
          <Button asChild>
            <Link href="/transactions/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Transaction
            </Link>
          </Button>
        </div>
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>Error while loading transactions</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            {transactions?.length || 0} total transaction(s)
          </p>
        </div>
        <Button asChild>
          <Link href="/transactions/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Transaction
          </Link>
        </Button>
      </div>

      {transactions && transactions.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>City</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Area</TableHead>
                <TableHead className="text-right">Date</TableHead>
                <TableHead className="text-right">Net Value</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead className="text-right">% Margin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.city}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.propertyType}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.area}m²
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(transaction.transactionDate).toLocaleDateString(
                      "fr-FR"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                    }).format(transaction.transactionNetValue)}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                    }).format(transaction.transactionCost)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-green-600">
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                    }).format(transaction.margin)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {transaction.marginPercentage.toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex h-[450px] flex-col items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">No transactions found</p>
          <Button asChild className="mt-4">
            <Link href="/transactions/new">
              <PlusIcon className="mr-2 h-4 w-4" />
              Create your first transaction
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
