-- CreateTable
CREATE TABLE "GraphicData" (
    "id" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GraphicData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GraphicData_value_idx" ON "GraphicData" USING GIN ("value" jsonb_path_ops);
