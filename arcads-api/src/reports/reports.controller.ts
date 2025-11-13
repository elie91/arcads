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
   * Returns the top 5 transactions with the highest margin
   */
  @Get('highest-margin')
  @HttpCode(HttpStatus.OK)
  async getHighestMargin(): Promise<HighestMarginReportDto> {
    this.logger.log('GET /reports/highest-margin');
    return this.reportsService.getHighestMargin();
  }

  /**
   * GET /reports/weekly-average-margin
   * Returns the weekly average margin with comparison
   */
  @Get('weekly-average-margin')
  @HttpCode(HttpStatus.OK)
  async getWeeklyAverageMargin(): Promise<WeeklyAverageMarginDto> {
    this.logger.log('GET /reports/weekly-average-margin');
    return this.reportsService.getWeeklyAverageMargin();
  }

  /**
   * GET /reports/city-performance
   * Returns the top 5 cities by average value
   */
  @Get('city-performance')
  @HttpCode(HttpStatus.OK)
  async getCityPerformance(): Promise<CityPerformanceReportDto> {
    this.logger.log('GET /reports/city-performance');
    return this.reportsService.getCityPerformance();
  }
}
