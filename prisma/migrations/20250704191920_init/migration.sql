/*
  Warnings:

  - You are about to drop the `SessionToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SessionToken" DROP CONSTRAINT "SessionToken_token_fkey";

-- DropForeignKey
ALTER TABLE "SessionToken" DROP CONSTRAINT "SessionToken_userId_fkey";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "canChangeEmail" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'green',
ADD COLUMN     "verificationAttempts" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "SessionToken";

-- CreateTable
CREATE TABLE "EmailVerificationCode" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerificationCode_pkey" PRIMARY KEY ("id")
);
