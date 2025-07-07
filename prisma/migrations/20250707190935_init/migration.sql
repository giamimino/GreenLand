-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "city" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "state" TEXT NOT NULL DEFAULT 'unknown';
