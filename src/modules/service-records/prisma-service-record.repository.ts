import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type { CreateServiceRecordInput, ServiceRecordFilters, ServiceRecordRow } from './service-record.types';
import type { ServiceRecordRepository } from './service-record.repository';

const include = {
  vehicle: {
    select: {
      id: true, plate: true, brand: true, model: true,
      company: { select: { id: true, name: true } },
      unit: { select: { id: true, name: true } },
    },
  },
  replacedParts: { select: { id: true, name: true, note: true } },
} as const;

@Injectable()
export class PrismaServiceRecordRepository implements ServiceRecordRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateServiceRecordInput): Promise<ServiceRecordRow> {
    return this.prisma.$transaction(async (tx) => {
      const record = await tx.serviceRecord.create({
        data: {
          vehicleId: input.vehicleId,
          type: input.type,
          serviceDate: input.serviceDate,
          mileageAtService: input.mileageAtService,
          performedWork: input.performedWork,
          provider: input.provider,
          totalCost: input.totalCost,
          note: input.note,
          nextMaintenanceMileage: input.nextMaintenanceMileage,
          createdById: input.createdById,
          replacedParts: input.replacedParts.length ? { create: input.replacedParts } : undefined,
        },
        include,
      });

      await tx.vehicle.update({
        where: { id: input.vehicleId },
        data: {
          currentMileage: input.mileageAtService,
          ...(input.type === 'MAINTENANCE' ? { lastMaintenanceMileage: input.mileageAtService } : {}),
          ...(input.nextMaintenanceMileage ? { nextMaintenanceMileage: input.nextMaintenanceMileage } : {}),
        },
      });
      return record;
    });
  }

  findAll(filters: ServiceRecordFilters): Promise<ServiceRecordRow[]> {
    return this.prisma.serviceRecord.findMany({
      where: this.where(filters), include,
      orderBy: [{ serviceDate: 'desc' }, { createdAt: 'desc' }],
      skip: filters.skip, take: filters.take,
    });
  }

  count(filters: Omit<ServiceRecordFilters, 'skip' | 'take'>): Promise<number> {
    return this.prisma.serviceRecord.count({ where: this.where(filters) });
  }

  async summarize(filters: Omit<ServiceRecordFilters, 'skip' | 'take'>) {
    const [maintenanceCount, repairCount, total] = await Promise.all([
      this.prisma.serviceRecord.count({ where: { ...this.where(filters), type: 'MAINTENANCE' } }),
      this.prisma.serviceRecord.count({ where: { ...this.where(filters), type: 'REPAIR' } }),
      this.prisma.serviceRecord.aggregate({ where: this.where(filters), _sum: { totalCost: true } }),
    ]);
    return { maintenanceCount, repairCount, totalCost: Number(total._sum.totalCost ?? 0) };
  }

  private where(filters: Omit<ServiceRecordFilters, 'skip' | 'take'>) {
    return {
      ...(filters.vehicleId ? { vehicleId: filters.vehicleId } : {}),
      ...(filters.companyId || filters.unitId ? { vehicle: {
        ...(filters.companyId ? { companyId: filters.companyId } : {}),
        ...(filters.unitId ? { unitId: filters.unitId } : {}),
      } } : {}),
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.dateFrom || filters.dateTo ? { serviceDate: {
        ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
        ...(filters.dateTo ? { lte: filters.dateTo } : {}),
      } } : {}),
    };
  }
}
