import { PrismaClient } from '../../generated/prisma';

// Create a single shared Prisma instance for all functions
export const prisma = new PrismaClient();
