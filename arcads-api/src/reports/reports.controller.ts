import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ReportsService } from './reports.service';
import {
  HighestMarginReportDto,
  WeeklyAverageMarginDto,
  CityPerformanceReportDto,
} from './dto';

@Controller('reports')
export class ReportsController {
  private readonly logger = new Logger(ReportsController.name);

  constructor(private readonly reportsService: ReportsService) {}

  /**
   * GET /reports/highest-margin
   * Retourne les 5 transactions avec la marge la plus élevée
   */
  @Get('highest-margin')
  @HttpCode(HttpStatus.OK)
  async getHighestMargin(): Promise<HighestMarginReportDto> {
    this.logger.log('GET /reports/highest-margin');
    return this.reportsService.getHighestMargin();
  }

  /**
   * GET /reports/weekly-average-margin
   * Retourne la marge moyenne hebdomadaire avec comparaison
   */
  @Get('weekly-average-margin')
  @HttpCode(HttpStatus.OK)
  async getWeeklyAverageMargin(): Promise<WeeklyAverageMarginDto> {
    this.logger.log('GET /reports/weekly-average-margin');
    return this.reportsService.getWeeklyAverageMargin();
  }

  /**
   * GET /reports/city-performance
   * Retourne les 5 meilleures villes par valeur moyenne
   */
  @Get('city-performance')
  @HttpCode(HttpStatus.OK)
  async getCityPerformance(): Promise<CityPerformanceReportDto> {
    this.logger.log('GET /reports/city-performance');
    return this.reportsService.getCityPerformance();
  }
}
