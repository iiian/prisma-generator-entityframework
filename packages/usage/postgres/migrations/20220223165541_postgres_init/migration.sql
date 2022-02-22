/*
  Warnings:

  - Added the required column `uno_bit` to the `AllFieldsTest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AllFieldsTest" ADD COLUMN     "uno_bit" BIT NOT NULL;
