-- CreateTable
CREATE TABLE `ShardMap` (
    `route` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `shard_index` INTEGER NOT NULL,

    PRIMARY KEY (`route`, `country`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
