import type { OwnerType } from '../../generated/prisma/enums';

export enum MaintenanceStatus {
  NORMAL = 'NORMAL',
  APPROACHING = 'APPROACHING',
  OVERDUE = 'OVERDUE',
  NOT_PLANNED = 'NOT_PLANNED',
}

export interface VehicleRecord {
  id: string;
  plate: string;
  brand: string;
  model: string;
  modelYear: number;
  vehicleType: string;
  currentMileage: number;
  ownerType: OwnerType;
  registeredOwner: string;
  companyId: string;
  unitId: string;
  hasHgs: boolean;
  lastMaintenanceMileage: number | null;
  nextMaintenanceMileage: number | null;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleRecordWithRelations extends VehicleRecord {
  company: { id: string; name: string };
  unit: { id: string; name: string };
}

export type CreateVehicleInput = Omit<
  VehicleRecord,
  'id' | 'createdAt' | 'updatedAt' | 'lastMaintenanceMileage' | 'nextMaintenanceMileage' | 'note'
> & {
  lastMaintenanceMileage?: number;
  nextMaintenanceMileage?: number;
  note?: string;
};

export type UpdateVehicleInput = Omit<
  Partial<CreateVehicleInput>,
  'lastMaintenanceMileage' | 'nextMaintenanceMileage' | 'note'
> & {
  lastMaintenanceMileage?: number | null;
  nextMaintenanceMileage?: number | null;
  note?: string | null;
};

export interface VehicleListFilters {
  search?: string;
  companyId?: string;
  unitId?: string;
  hasHgs?: boolean;
}

export interface VehicleView extends VehicleRecordWithRelations {
  maintenanceStatus: MaintenanceStatus;
  remainingMaintenanceMileage: number | null;
}

export interface PaginatedVehicles {
  data: VehicleView[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
