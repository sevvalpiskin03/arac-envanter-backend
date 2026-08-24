import type { ServiceType } from '../../generated/prisma/enums';

export interface ServiceRecordFilters {
  vehicleId?: string;
  companyId?: string;
  unitId?: string;
  type?: ServiceType;
  dateFrom?: Date;
  dateTo?: Date;
  skip: number;
  take: number;
}

export interface CreateServiceRecordInput {
  vehicleId: string;
  type: ServiceType;
  serviceDate: Date;
  mileageAtService: number;
  performedWork: string;
  provider?: string;
  totalCost: number;
  note?: string;
  nextMaintenanceMileage?: number;
  createdById: string;
  replacedParts: { name: string; note?: string }[];
}

export interface ServiceRecordRow {
  id: string;
  vehicleId: string;
  type: ServiceType;
  serviceDate: Date;
  mileageAtService: number;
  performedWork: string;
  provider: string | null;
  totalCost: unknown;
  note: string | null;
  nextMaintenanceMileage: number | null;
  createdAt: Date;
  vehicle: {
    id: string;
    plate: string;
    brand: string;
    model: string;
    company: { id: string; name: string };
    unit: { id: string; name: string };
  };
  replacedParts: { id: string; name: string; note: string | null }[];
}

export interface ServiceRecordView extends Omit<ServiceRecordRow, 'totalCost'> {
  totalCost: number;
}

export interface ServiceRecordList {
  data: ServiceRecordView[];
  summary: { total: number; maintenanceCount: number; repairCount: number; totalCost: number };
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
