-- CreateTable
CREATE TABLE "ShardMap" (
    "route" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "shard_index" INTEGER NOT NULL,

    PRIMARY KEY ("route", "country")
);
