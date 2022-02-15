-- CreateTable
CREATE TABLE "system_user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "system_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "creator_id" INTEGER NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "creator_id" INTEGER NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_user_email_key" ON "system_user"("email");

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "system_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "system_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
