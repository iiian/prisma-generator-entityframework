-- CreateTable
CREATE TABLE "pg_db_uuid_type" (
    "id" UUID NOT NULL,
    "data" INTEGER NOT NULL,

    CONSTRAINT "pg_db_uuid_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pg_text_uuid_type" (
    "id" TEXT NOT NULL,
    "data" INTEGER NOT NULL,

    CONSTRAINT "pg_text_uuid_type_pkey" PRIMARY KEY ("id")
);
