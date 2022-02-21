-- CreateTable
CREATE TABLE "system_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "creator_id" INTEGER NOT NULL,
    CONSTRAINT "post_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "system_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "post_id" INTEGER NOT NULL,
    "creator_id" INTEGER NOT NULL,
    CONSTRAINT "comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT "comment_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "system_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "system_user_email_key" ON "system_user"("email");
