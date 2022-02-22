/*
  Warnings:

  - Changed the type of `uno_bit` on the `AllFieldsTest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "AllFieldsTest" DROP COLUMN "uno_bit",
ADD COLUMN     "uno_bit" BIT NOT NULL;
