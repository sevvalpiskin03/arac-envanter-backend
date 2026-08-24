-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('PERSON', 'COMPANY');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('MAINTENANCE', 'REPAIR');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('MAINTENANCE_APPROACHING', 'MAINTENANCE_OVERDUE');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "modelYear" INTEGER NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "currentMileage" INTEGER NOT NULL,
    "ownerType" "OwnerType" NOT NULL,
    "registeredOwner" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "hasHgs" BOOLEAN NOT NULL,
    "lastMaintenanceMileage" INTEGER,
    "nextMaintenanceMileage" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MileageRecord" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "previousMileage" INTEGER NOT NULL,
    "newMileage" INTEGER NOT NULL,
    "recordedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MileageRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRecord" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "type" "ServiceType" NOT NULL,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "mileageAtService" INTEGER NOT NULL,
    "performedWork" TEXT NOT NULL,
    "provider" TEXT,
    "totalCost" DECIMAL(12,2) NOT NULL,
    "note" TEXT,
    "nextMaintenanceMileage" INTEGER,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReplacedPart" (
    "id" TEXT NOT NULL,
    "serviceRecordId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "ReplacedPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "serviceRecordId" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSetting" (
    "id" TEXT NOT NULL,
    "warningMileageThreshold" INTEGER NOT NULL DEFAULT 1000,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "recipientEmails" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "mileageSnapshot" INTEGER NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Unit_companyId_idx" ON "Unit"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_companyId_name_key" ON "Unit"("companyId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plate_key" ON "Vehicle"("plate");

-- CreateIndex
CREATE INDEX "Vehicle_companyId_idx" ON "Vehicle"("companyId");

-- CreateIndex
CREATE INDEX "Vehicle_unitId_idx" ON "Vehicle"("unitId");

-- CreateIndex
CREATE INDEX "Vehicle_nextMaintenanceMileage_idx" ON "Vehicle"("nextMaintenanceMileage");

-- CreateIndex
CREATE INDEX "MileageRecord_vehicleId_createdAt_idx" ON "MileageRecord"("vehicleId", "createdAt");

-- CreateIndex
CREATE INDEX "ServiceRecord_vehicleId_serviceDate_idx" ON "ServiceRecord"("vehicleId", "serviceDate");

-- CreateIndex
CREATE INDEX "ServiceRecord_type_idx" ON "ServiceRecord"("type");

-- CreateIndex
CREATE INDEX "ReplacedPart_serviceRecordId_idx" ON "ReplacedPart"("serviceRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_storageKey_key" ON "Attachment"("storageKey");

-- CreateIndex
CREATE INDEX "Attachment_serviceRecordId_idx" ON "Attachment"("serviceRecordId");

-- CreateIndex
CREATE INDEX "NotificationLog_vehicleId_type_sentAt_idx" ON "NotificationLog"("vehicleId", "type", "sentAt");

-- AddForeignKey
ALTER TABLE "Unit" ADD CONSTRAINT "Unit_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MileageRecord" ADD CONSTRAINT "MileageRecord_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MileageRecord" ADD CONSTRAINT "MileageRecord_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplacedPart" ADD CONSTRAINT "ReplacedPart_serviceRecordId_fkey" FOREIGN KEY ("serviceRecordId") REFERENCES "ServiceRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_serviceRecordId_fkey" FOREIGN KEY ("serviceRecordId") REFERENCES "ServiceRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
