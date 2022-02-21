BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ShardMap] (
    [route] NVARCHAR(1000) NOT NULL,
    [country] NVARCHAR(1000) NOT NULL,
    [shard_index] INT NOT NULL,
    CONSTRAINT [ShardMap_pkey] PRIMARY KEY ([route],[country])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
