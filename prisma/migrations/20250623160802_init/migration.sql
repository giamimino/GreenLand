-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "image" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "isSale" BOOLEAN NOT NULL DEFAULT false,
    "isBestSelling" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "view" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Products_slug_key" ON "Products"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Products_isSale_key" ON "Products"("isSale");

-- CreateIndex
CREATE UNIQUE INDEX "Products_isBestSelling_key" ON "Products"("isBestSelling");

-- CreateIndex
CREATE UNIQUE INDEX "Products_view_key" ON "Products"("view");
