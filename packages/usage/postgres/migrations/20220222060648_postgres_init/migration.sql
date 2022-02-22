/*
  Warnings:

  - You are about to drop the `pg_db_uuid_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pg_text_uuid_type` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "pg_db_uuid_type";

-- DropTable
DROP TABLE "pg_text_uuid_type";

-- CreateTable
CREATE TABLE "db_uuid_type" (
    "id" UUID NOT NULL,
    "data" INTEGER NOT NULL,

    CONSTRAINT "db_uuid_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "text_uuid_type" (
    "id" TEXT NOT NULL,
    "data" INTEGER NOT NULL,

    CONSTRAINT "text_uuid_type_pkey" PRIMARY KEY ("id")
);
