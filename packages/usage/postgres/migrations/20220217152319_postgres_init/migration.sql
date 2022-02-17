-- CreateTable
CREATE TABLE "ShardMap" (
    "route" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "shard_index" INTEGER NOT NULL,

    CONSTRAINT "ShardMap_pkey" PRIMARY KEY ("route","country")
);
