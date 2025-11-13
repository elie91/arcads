import { PrismaClient, PropertyType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.transaction.deleteMany({});
  console.log('Cleared existing transactions');

  // Generate seed data with realistic French cities and varied property types
  const cities = [
    'Paris',
    'Lyon',
    'Marseille',
    'Toulouse',
    'Nice',
    'Nantes',
    'Strasbourg',
    'Montpellier',
    'Bordeaux',
    'Lille',
    'Rennes',
    'Reims',
    'Le Havre',
    'Saint-Étienne',
    'Toulon',
  ];

  const propertyTypes = [
    PropertyType.APARTMENT,
    PropertyType.HOUSE,
    PropertyType.LAND,
  ];

  const transactions: {
    city: string;
    propertyType: PropertyType;
    area: number;
    transactionDate: Date;
    transactionNetValue: number;
    transactionCost: number;
  }[] = [];

  // Generate 30 transactions with varied data
  for (let i = 0; i < 30; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const propertyType =
      propertyTypes[Math.floor(Math.random() * propertyTypes.length)];

    // Generate realistic values based on property type
    let area: number;
    let transactionNetValue: number;
    let transactionCost: number;

    if (propertyType === PropertyType.APARTMENT) {
      area = Math.floor(Math.random() * 100) + 30; // 30-130 m²
      const pricePerSqm = Math.floor(Math.random() * 5000) + 3000; // 3000-8000 EUR/m²
      transactionNetValue = area * pricePerSqm;
      transactionCost = transactionNetValue * (0.7 + Math.random() * 0.2); // 70-90% of net value
    } else if (propertyType === PropertyType.HOUSE) {
      area = Math.floor(Math.random() * 150) + 80; // 80-230 m²
      const pricePerSqm = Math.floor(Math.random() * 3000) + 2000; // 2000-5000 EUR/m²
      transactionNetValue = area * pricePerSqm;
      transactionCost = transactionNetValue * (0.65 + Math.random() * 0.25); // 65-90% of net value
    } else {
      // LAND
      area = Math.floor(Math.random() * 2000) + 500; // 500-2500 m²
      const pricePerSqm = Math.floor(Math.random() * 200) + 50; // 50-250 EUR/m²
      transactionNetValue = area * pricePerSqm;
      transactionCost = transactionNetValue * (0.6 + Math.random() * 0.3); // 60-90% of net value
    }

    // Generate transaction dates over the past 3 months
    const daysAgo = Math.floor(Math.random() * 90);
    const transactionDate = new Date();
    transactionDate.setDate(transactionDate.getDate() - daysAgo);

    transactions.push({
      city,
      propertyType,
      area: Math.round(area),
      transactionDate,
      transactionNetValue: Math.round(transactionNetValue),
      transactionCost: Math.round(transactionCost),
    });
  }

  // Add some specific high-margin transactions for testing
  transactions.push(
    {
      city: 'Paris',
      propertyType: PropertyType.APARTMENT,
      area: 120,
      transactionDate: new Date(),
      transactionNetValue: 1200000,
      transactionCost: 800000, // 50% margin
    },
    {
      city: 'Lyon',
      propertyType: PropertyType.HOUSE,
      area: 200,
      transactionDate: new Date(),
      transactionNetValue: 900000,
      transactionCost: 550000, // ~63% margin
    },
    {
      city: 'Marseille',
      propertyType: PropertyType.LAND,
      area: 1500,
      transactionDate: new Date(),
      transactionNetValue: 300000,
      transactionCost: 180000, // ~67% margin
    },
  );

  // Insert all transactions
  for (const transaction of transactions) {
    await prisma.transaction.create({
      data: transaction,
    });
  }

  console.log(`Successfully seeded ${transactions.length} transactions`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
