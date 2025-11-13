"use client";

import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeeklyAverageMarginReport } from "@/hooks/queries/useReports";

export function WeeklyAverageCard() {
  const { data, isLoading, error } = useWeeklyAverageMarginReport();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Marge Moyenne Hebdomadaire</CardTitle>
          <CardDescription>
            Comparaison avec la semaine précédente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Marge Moyenne Hebdomadaire</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Erreur lors du chargement des données
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Marge Moyenne Hebdomadaire</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucune donnée disponible
          </p>
        </CardContent>
      </Card>
    );
  }

  const isPositiveChange = data.change.percentageChange >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marge Moyenne Hebdomadaire</CardTitle>
        <CardDescription>
          Comparaison avec la semaine précédente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Semaine en cours
            </p>
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              }).format(data.currentWeek.averageMargin)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {data.currentWeek.transactionCount} transactions •{" "}
            {data.currentWeek.averageMarginPercentage.toFixed(1)}% de marge
          </p>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Semaine précédente
            </p>
            <p className="text-lg font-semibold">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              }).format(data.previousWeek.averageMargin)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {data.previousWeek.transactionCount} transactions
          </p>
        </div>

        <div
          className={`flex items-center gap-2 rounded-lg p-3 ${
            isPositiveChange ? "bg-green-50" : "bg-red-50"
          }`}
        >
          {isPositiveChange ? (
            <ArrowUpIcon className="h-5 w-5 text-green-600" />
          ) : (
            <ArrowDownIcon className="h-5 w-5 text-red-600" />
          )}
          <div>
            <p
              className={`text-lg font-bold ${
                isPositiveChange ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositiveChange ? "+" : ""}
              {data.change.percentageChange.toFixed(1)}%
            </p>
            <p className="text-sm text-muted-foreground">
              {isPositiveChange ? "+" : ""}
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
                maximumFractionDigits: 0,
              }).format(data.change.marginDifference)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
