import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  HighestMarginReportDto,
  HighestMarginItemDto,
  WeeklyAverageMarginDto,
  CityPerformanceReportDto,
  CityPerformanceItemDto,
} from './dto';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * GET /reports/highest-margin
   * Retourne les 5 transactions avec la marge la plus élevée
   */
  async getHighestMargin(): Promise<HighestMarginReportDto> {
    this.logger.log('Fetching highest margin transactions');

    const transactions = await this.prisma.transaction.findMany({
      orderBy: {
        transactionNetValue: 'desc', // Tri par valeur nette décroissante pour avoir les plus grosses marges
      },
      take: 100, // On prend plus que nécessaire pour calculer la marge
    });

    // Calculer la marge pour chaque transaction et trier par marge
    const transactionsWithMargin = transactions
      .map((transaction) => {
        const margin =
          transaction.transactionNetValue - transaction.transactionCost;
        const marginPercentage =
          transaction.transactionCost > 0
            ? (margin / transaction.transactionCost) * 100
            : 0;

        return {
          id: transaction.id,
          city: transaction.city,
          propertyType: transaction.propertyType,
          area: transaction.area,
          transactionDate: transaction.transactionDate,
          transactionNetValue: transaction.transactionNetValue,
          transactionCost: transaction.transactionCost,
          margin,
          marginPercentage,
        } as HighestMarginItemDto;
      })
      .sort((a, b) => b.margin - a.margin) // Trier par marge décroissante
      .slice(0, 5); // Prendre les 5 premiers

    this.logger.log(
      `Found ${transactionsWithMargin.length} highest margin transactions`,
    );

    return {
      topTransactions: transactionsWithMargin,
      count: transactionsWithMargin.length,
    };
  }

  /**
   * GET /reports/weekly-average-margin
   * Retourne la marge moyenne de la semaine en cours vs la semaine précédente
   */
  async getWeeklyAverageMargin(): Promise<WeeklyAverageMarginDto> {
    this.logger.log('Calculating weekly average margin');

    const now = new Date();

    // Calculer les dates de début et fin pour la semaine en cours (lundi à dimanche)
    const currentWeekStart = new Date(now);
    currentWeekStart.setDate(now.getDate() - now.getDay() + 1); // Lundi
    currentWeekStart.setHours(0, 0, 0, 0);

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // Dimanche
    currentWeekEnd.setHours(23, 59, 59, 999);

    // Calculer les dates pour la semaine précédente
    const previousWeekStart = new Date(currentWeekStart);
    previousWeekStart.setDate(currentWeekStart.getDate() - 7);

    const previousWeekEnd = new Date(currentWeekEnd);
    previousWeekEnd.setDate(currentWeekEnd.getDate() - 7);

    // Récupérer les transactions de la semaine en cours
    const currentWeekTransactions = await this.prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: currentWeekStart,
          lte: currentWeekEnd,
        },
      },
    });

    // Récupérer les transactions de la semaine précédente
    const previousWeekTransactions = await this.prisma.transaction.findMany({
      where: {
        transactionDate: {
          gte: previousWeekStart,
          lte: previousWeekEnd,
        },
      },
    });

    // Calculer les moyennes pour la semaine en cours
    const currentWeekMargins = currentWeekTransactions.map(
      (t) => t.transactionNetValue - t.transactionCost,
    );
    const currentWeekAvgMargin =
      currentWeekMargins.length > 0
        ? currentWeekMargins.reduce((a, b) => a + b, 0) /
          currentWeekMargins.length
        : 0;

    const currentWeekAvgMarginPercentage =
      currentWeekTransactions.length > 0
        ? currentWeekTransactions.reduce((sum, t) => {
            const margin = t.transactionNetValue - t.transactionCost;
            return (
              sum +
              (t.transactionCost > 0 ? (margin / t.transactionCost) * 100 : 0)
            );
          }, 0) / currentWeekTransactions.length
        : 0;

    // Calculer les moyennes pour la semaine précédente
    const previousWeekMargins = previousWeekTransactions.map(
      (t) => t.transactionNetValue - t.transactionCost,
    );
    const previousWeekAvgMargin =
      previousWeekMargins.length > 0
        ? previousWeekMargins.reduce((a, b) => a + b, 0) /
          previousWeekMargins.length
        : 0;

    const previousWeekAvgMarginPercentage =
      previousWeekTransactions.length > 0
        ? previousWeekTransactions.reduce((sum, t) => {
            const margin = t.transactionNetValue - t.transactionCost;
            return (
              sum +
              (t.transactionCost > 0 ? (margin / t.transactionCost) * 100 : 0)
            );
          }, 0) / previousWeekTransactions.length
        : 0;

    // Calculer le changement
    const marginDifference = currentWeekAvgMargin - previousWeekAvgMargin;
    const percentageChange =
      previousWeekAvgMargin > 0
        ? ((currentWeekAvgMargin - previousWeekAvgMargin) /
            previousWeekAvgMargin) *
          100
        : 0;

    this.logger.log(
      `Current week: ${currentWeekTransactions.length} transactions, avg margin: ${currentWeekAvgMargin.toFixed(2)}`,
    );
    this.logger.log(
      `Previous week: ${previousWeekTransactions.length} transactions, avg margin: ${previousWeekAvgMargin.toFixed(2)}`,
    );

    return {
      currentWeek: {
        averageMargin: currentWeekAvgMargin,
        averageMarginPercentage: currentWeekAvgMarginPercentage,
        transactionCount: currentWeekTransactions.length,
        startDate: currentWeekStart,
        endDate: currentWeekEnd,
      },
      previousWeek: {
        averageMargin: previousWeekAvgMargin,
        averageMarginPercentage: previousWeekAvgMarginPercentage,
        transactionCount: previousWeekTransactions.length,
        startDate: previousWeekStart,
        endDate: previousWeekEnd,
      },
      change: {
        marginDifference,
        percentageChange,
      },
    };
  }

  /**
   * GET /reports/city-performance
   * Retourne les 5 meilleures villes par valeur moyenne de transaction
   */
  async getCityPerformance(): Promise<CityPerformanceReportDto> {
    this.logger.log('Calculating city performance');

    // Récupérer toutes les transactions groupées par ville via Prisma
    const transactions = await this.prisma.transaction.findMany();

    // Grouper par ville et calculer les statistiques
    const cityStats = new Map<string, CityPerformanceItemDto>();

    transactions.forEach((transaction) => {
      const margin =
        transaction.transactionNetValue - transaction.transactionCost;
      const marginPercentage =
        transaction.transactionCost > 0
          ? (margin / transaction.transactionCost) * 100
          : 0;

      if (!cityStats.has(transaction.city)) {
        cityStats.set(transaction.city, {
          city: transaction.city,
          averageTransactionValue: 0,
          transactionCount: 0,
          totalValue: 0,
          averageMargin: 0,
          averageMarginPercentage: 0,
        });
      }

      const stats = cityStats.get(transaction.city)!;
      stats.transactionCount++;
      stats.totalValue += transaction.transactionNetValue;
      stats.averageMargin += margin;
      stats.averageMarginPercentage += marginPercentage;
    });

    // Calculer les moyennes et convertir en tableau
    const cityPerformances = Array.from(cityStats.values()).map((stats) => ({
      ...stats,
      averageTransactionValue: stats.totalValue / stats.transactionCount,
      averageMargin: stats.averageMargin / stats.transactionCount,
      averageMarginPercentage:
        stats.averageMarginPercentage / stats.transactionCount,
    }));

    // Trier par valeur moyenne décroissante et prendre le top 5
    const topCities = cityPerformances
      .sort((a, b) => b.averageTransactionValue - a.averageTransactionValue)
      .slice(0, 5);

    this.logger.log(`Found ${topCities.length} top performing cities`);

    return {
      topCities,
      count: topCities.length,
    };
  }
}
