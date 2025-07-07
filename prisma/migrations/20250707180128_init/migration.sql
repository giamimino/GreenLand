-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "address" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "postalCode" INTEGER;
