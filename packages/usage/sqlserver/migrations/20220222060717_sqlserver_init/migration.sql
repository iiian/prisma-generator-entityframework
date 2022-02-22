BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[db_uuid_type] (
    [id] UNIQUEIDENTIFIER NOT NULL,
    [data] INT NOT NULL,
    CONSTRAINT [db_uuid_type_pkey] PRIMARY KEY ([id])
);

-- CreateTable
CREATE TABLE [dbo].[text_uuid_type] (
    [id] NVARCHAR(1000) NOT NULL,
    [data] INT NOT NULL,
    CONSTRAINT [text_uuid_type_pkey] PRIMARY KEY ([id])
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
