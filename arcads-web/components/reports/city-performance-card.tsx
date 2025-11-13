"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCityPerformanceReport } from "@/hooks/queries/useReports";

export function CityPerformanceCard() {
  const { data, isLoading, error } = useCityPerformanceReport();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Villes par Performance</CardTitle>
          <CardDescription>
            Classement par valeur moyenne de transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
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
          <CardTitle>Top 5 Villes par Performance</CardTitle>
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

  if (!data || data.topCities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Villes par Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucune donnée disponible
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Villes par Performance</CardTitle>
        <CardDescription>
          Classement par valeur moyenne de transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.topCities.map((city, index) => (
            <div
              key={city.city}
              className="flex items-start justify-between border-b pb-4 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <div className="space-y-1">
                  <p className="font-semibold">{city.city}</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {city.transactionCount} transactions
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {city.averageMarginPercentage.toFixed(1)}% marge
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  }).format(city.averageTransactionValue)}
                </p>
                <p className="text-sm text-muted-foreground">valeur moy.</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
