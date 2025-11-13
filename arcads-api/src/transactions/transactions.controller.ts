import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TransactionResponseDto } from './dto';

@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * POST /transactions - Create a new transaction
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    this.logger.log('POST /transactions - Creating new transaction');
    return this.transactionsService.create(createTransactionDto);
  }

  /**
   * GET /transactions - Get all transactions
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<TransactionResponseDto[]> {
    this.logger.log('GET /transactions - Fetching all transactions');
    return this.transactionsService.findAll();
  }

  /**
   * GET /transactions/:id - Get a transaction by ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<TransactionResponseDto> {
    this.logger.log(`GET /transactions/${id} - Fetching transaction`);
    return this.transactionsService.findOne(id);
  }
}
