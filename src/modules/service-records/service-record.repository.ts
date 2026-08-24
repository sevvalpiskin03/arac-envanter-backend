import type { CreateServiceRecordInput, ServiceRecordFilters, ServiceRecordRow } from './service-record.types';

export const SERVICE_RECORD_REPOSITORY = Symbol('SERVICE_RECORD_REPOSITORY');

export interface ServiceRecordRepository {
  create(input: CreateServiceRecordInput): Promise<ServiceRecordRow>;
  findAll(filters: ServiceRecordFilters): Promise<ServiceRecordRow[]>;
  count(filters: Omit<ServiceRecordFilters, 'skip' | 'take'>): Promise<number>;
  summarize(filters: Omit<ServiceRecordFilters, 'skip' | 'take'>): Promise<{
    maintenanceCount: number;
    repairCount: number;
    totalCost: number;
  }>;
}
