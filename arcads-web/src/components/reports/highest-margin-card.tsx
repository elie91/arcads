"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHighestMarginReport } from "@/hooks/queries/useReports";

export function HighestMarginCard() {
  const { data, isLoading, error } = useHighestMarginReport();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Highest Margins</CardTitle>
          <CardDescription>Transactions with the best margins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Highest Margins</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>Error while loading data</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.topTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Highest Margins</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Highest Margins</CardTitle>
        <CardDescription>Transactions with the best margins</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.topTransactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between border-b pb-3 last:border-b-0"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{transaction.city}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.propertyType} • {transaction.area}m²
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  }).format(transaction.margin)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.marginPercentage.toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
