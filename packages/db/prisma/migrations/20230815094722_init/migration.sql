-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,
    "softDeletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,
    "softDeletedAt" TIMESTAMP(3),
    "shopifyShopPrefix" TEXT,
    "shopifyAdminApiAccessToken" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMembership" (
    "id" TEXT NOT NULL,
    "softDeleted" BOOLEAN NOT NULL DEFAULT false,
    "softDeletedAt" TIMESTAMP(3),
    "userId" TEXT,
    "organizationId" TEXT,

    CONSTRAINT "OrganizationMembership_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMembership" ADD CONSTRAINT "OrganizationMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
