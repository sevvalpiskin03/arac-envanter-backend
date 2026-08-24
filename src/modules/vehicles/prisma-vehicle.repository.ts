import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type { VehicleRepository } from './vehicle.repository';
import type {
  CreateVehicleInput,
  UpdateVehicleInput,
  VehicleListFilters,
  VehicleRecordWithRelations,
} from './vehicle.types';

const relations = {
  company: { select: { id: true, name: true } },
  unit: { select: { id: true, name: true } },
} as const;

@Injectable()
export class PrismaVehicleRepository implements VehicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateVehicleInput): Promise<VehicleRecordWithRelations> {
    return this.prisma.vehicle.create({ data: input, include: relations });
  }

  findAll(filters: VehicleListFilters): Promise<VehicleRecordWithRelations[]> {
    return this.prisma.vehicle.findMany({
      where: {
        ...(filters.companyId ? { companyId: filters.companyId } : {}),
        ...(filters.unitId ? { unitId: filters.unitId } : {}),
        ...(filters.hasHgs !== undefined ? { hasHgs: filters.hasHgs } : {}),
        ...(filters.search
          ? {
              OR: [
                { plate: { contains: filters.search, mode: 'insensitive' } },
                { brand: { contains: filters.search, mode: 'insensitive' } },
                { model: { contains: filters.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: relations,
      orderBy: [{ plate: 'asc' }],
    });
  }

  findById(id: string): Promise<VehicleRecordWithRelations | null> {
    return this.prisma.vehicle.findUnique({ where: { id }, include: relations });
  }

  findByPlate(plate: string): Promise<VehicleRecordWithRelations | null> {
    return this.prisma.vehicle.findUnique({ where: { plate }, include: relations });
  }

  update(id: string, input: UpdateVehicleInput): Promise<VehicleRecordWithRelations> {
    return this.prisma.vehicle.update({ where: { id }, data: input, include: relations });
  }
}
