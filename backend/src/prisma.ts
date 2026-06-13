import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

// PrismaClient lit DATABASE_URL automatiquement depuis le .env
const prisma = new PrismaClient();

export default prisma;
