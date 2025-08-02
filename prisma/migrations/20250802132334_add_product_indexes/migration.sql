-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");

-- CreateIndex
CREATE INDEX "Product_view_idx" ON "Product"("view");

-- CreateIndex
CREATE INDEX "Product_isSale_idx" ON "Product"("isSale");

-- CreateIndex
CREATE INDEX "Product_isBestSelling_idx" ON "Product"("isBestSelling");
