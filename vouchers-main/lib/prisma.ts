/**
 * Prisma Client Configuration
 * 
 * Initializes and exports a singleton Prisma client instance.
 * Prevents multiple Prisma client instantiations in development (which causes connection issues).
 * Uses global scope to maintain single connection across hot reloads.
 * 
 * In production, a new client is created.
 * In development, the same client instance is reused.
 */

import { PrismaClient } from '@prisma/client'

/**
 * Global type augmentation for Prisma client singleton
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient }

/**
 * Prisma Client instance
 * 
 * - Development: Reused across hot reloads via global scope
 * - Production: Fresh instance for each server
 * 
 * @type {PrismaClient}
 */
export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
