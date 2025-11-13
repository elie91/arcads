import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TransactionResponseDto } from './dto';
import { PropertyType } from '@prisma/client';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransactionResponse: TransactionResponseDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    city: 'Paris',
    propertyType: PropertyType.APARTMENT,
    area: 75.5,
    transactionDate: new Date('2024-01-15'),
    transactionNetValue: 500000,
    transactionCost: 400000,
    margin: 100000,
    marginPercentage: 25,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateTransactionDto: CreateTransactionDto = {
    city: 'Paris',
    propertyType: PropertyType.APARTMENT,
    area: 75.5,
    transactionDate: '2024-01-15',
    transactionNetValue: 500000,
    transactionCost: 400000,
  };

  const mockTransactionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      mockTransactionsService.create.mockResolvedValue(mockTransactionResponse);

      const result = await controller.create(mockCreateTransactionDto);

      expect(service.create).toHaveBeenCalledWith(mockCreateTransactionDto);
      expect(result).toEqual(mockTransactionResponse);
      expect(result.margin).toBe(100000);
      expect(result.marginPercentage).toBe(25);
    });

    it('should return TransactionResponseDto with correct structure', async () => {
      mockTransactionsService.create.mockResolvedValue(mockTransactionResponse);

      const result = await controller.create(mockCreateTransactionDto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('city');
      expect(result).toHaveProperty('propertyType');
      expect(result).toHaveProperty('area');
      expect(result).toHaveProperty('transactionDate');
      expect(result).toHaveProperty('transactionNetValue');
      expect(result).toHaveProperty('transactionCost');
      expect(result).toHaveProperty('margin');
      expect(result).toHaveProperty('marginPercentage');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const mockTransactions = [mockTransactionResponse, mockTransactionResponse];
      mockTransactionsService.findAll.mockResolvedValue(mockTransactions);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockTransactions);
      expect(result).toHaveLength(2);
    });

    it('should return an empty array when no transactions exist', async () => {
      mockTransactionsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      const transactionId = '123e4567-e89b-12d3-a456-426614174000';
      mockTransactionsService.findOne.mockResolvedValue(mockTransactionResponse);

      const result = await controller.findOne(transactionId);

      expect(service.findOne).toHaveBeenCalledWith(transactionId);
      expect(result).toEqual(mockTransactionResponse);
      expect(result.id).toBe(transactionId);
    });

    it('should throw NotFoundException when transaction does not exist', async () => {
      const nonExistentId = 'non-existent-id';
      mockTransactionsService.findOne.mockRejectedValue(
        new NotFoundException(`Transaction with id ${nonExistentId} not found`),
      );

      await expect(controller.findOne(nonExistentId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(nonExistentId);
    });
  });
});
