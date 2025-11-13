import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTransactionDto, TransactionResponseDto } from './dto';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Créer une nouvelle transaction
   */
  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    this.logger.log('Creating new transaction');

    const transaction = await this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
        transactionDate: new Date(createTransactionDto.transactionDate),
      },
    });

    this.logger.log(`Transaction created with id: ${transaction.id}`);
    return new TransactionResponseDto(transaction);
  }

  /**
   * Récupérer toutes les transactions
   */
  async findAll(): Promise<TransactionResponseDto[]> {
    this.logger.log('Fetching all transactions');

    const transactions = await this.prisma.transaction.findMany({
      orderBy: {
        transactionDate: 'desc',
      },
    });

    this.logger.log(`Found ${transactions.length} transactions`);
    return transactions.map(
      (transaction) => new TransactionResponseDto(transaction),
    );
  }

  /**
   * Récupérer une transaction par ID
   */
  async findOne(id: string): Promise<TransactionResponseDto> {
    this.logger.log(`Fetching transaction with id: ${id}`);

    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }

    return new TransactionResponseDto(transaction);
  }
}
