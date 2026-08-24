import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type { UnitRepository } from './unit.repository';
import type {
  CreateUnitInput,
  UnitRecord,
  UpdateUnitInput,
} from './unit.types';

@Injectable()
export class PrismaUnitRepository implements UnitRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateUnitInput): Promise<UnitRecord> {
    return this.prisma.unit.create({ data: input });
  }

  findByCompany(companyId: string): Promise<UnitRecord[]> {
    return this.prisma.unit.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
    });
  }

  findByCompanyAndName(
    companyId: string,
    name: string,
  ): Promise<UnitRecord | null> {
    return this.prisma.unit.findUnique({
      where: { companyId_name: { companyId, name } },
    });
  }

  findById(id: string): Promise<UnitRecord | null> {
    return this.prisma.unit.findUnique({ where: { id } });
  }

  update(id: string, input: UpdateUnitInput): Promise<UnitRecord> {
    return this.prisma.unit.update({ where: { id }, data: input });
  }
}
