-- CreateTable
CREATE TABLE "CostOfDeliveryLineItems" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "organizationId" TEXT,

    CONSTRAINT "CostOfDeliveryLineItems_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CostOfDeliveryLineItems" ADD CONSTRAINT "CostOfDeliveryLineItems_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
