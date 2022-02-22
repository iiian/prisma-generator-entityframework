/*
  Warnings:

  - Added the required column `bytes` to the `AllFieldsTest` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `uno_bit` on the `AllFieldsTest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AllFieldsTest" ADD COLUMN     "bytes" BYTEA NOT NULL,
DROP COLUMN "uno_bit",
ADD COLUMN     "uno_bit" BIT NOT NULL;
