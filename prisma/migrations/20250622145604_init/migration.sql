-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "image" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_slug_key" ON "Products"("slug");
