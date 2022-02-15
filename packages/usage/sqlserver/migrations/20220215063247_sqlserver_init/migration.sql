BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[system_user] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    CONSTRAINT [system_user_pkey] PRIMARY KEY ([id]),
    CONSTRAINT [system_user_email_key] UNIQUE ([email])
);

-- CreateTable
CREATE TABLE [dbo].[post] (
    [id] INT NOT NULL IDENTITY(1,1),
    [content] NVARCHAR(1000) NOT NULL,
    [created_at] DATETIME2 NOT NULL,
    [creator_id] INT NOT NULL,
    CONSTRAINT [post_pkey] PRIMARY KEY ([id])
);

-- CreateTable
CREATE TABLE [dbo].[comment] (
    [id] INT NOT NULL IDENTITY(1,1),
    [post_id] INT NOT NULL,
    [creator_id] INT NOT NULL,
    CONSTRAINT [comment_pkey] PRIMARY KEY ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[post] ADD CONSTRAINT [post_creator_id_fkey] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[system_user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[comment] ADD CONSTRAINT [comment_post_id_fkey] FOREIGN KEY ([post_id]) REFERENCES [dbo].[post]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[comment] ADD CONSTRAINT [comment_creator_id_fkey] FOREIGN KEY ([creator_id]) REFERENCES [dbo].[system_user]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
