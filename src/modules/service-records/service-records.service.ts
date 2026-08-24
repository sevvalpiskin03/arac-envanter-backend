import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { AuthenticatedAdmin } from '../auth/auth.types';
import { VehiclesService } from '../vehicles/vehicles.service';
import type { CreateServiceRecordDto } from './dto/create-service-record.dto';
import type { ListServiceRecordsQueryDto } from './dto/list-service-records-query.dto';
import { SERVICE_RECORD_REPOSITORY, type ServiceRecordRepository } from './service-record.repository';
import type { ServiceRecordFilters, ServiceRecordList, ServiceRecordView } from './service-record.types';

@Injectable()
export class ServiceRecordsService {
  constructor(
    @Inject(SERVICE_RECORD_REPOSITORY) private readonly records: ServiceRecordRepository,
    private readonly vehicles: VehiclesService,
  ) {}

  async list(query: ListServiceRecordsQueryDto): Promise<ServiceRecordList> {
    const base = this.filters(query);
    const [rows, total, summary] = await Promise.all([
      this.records.findAll({ ...base, skip: (query.page - 1) * query.limit, take: query.limit }),
      this.records.count(base),
      this.records.summarize(base),
    ]);
    return {
      data: rows.map((row) => ({ ...row, totalCost: Number(row.totalCost) })),
      summary: { total, ...summary },
      pagination: { page: query.page, limit: query.limit, total, totalPages: Math.max(1, Math.ceil(total / query.limit)) },
    };
  }

  async create(input: CreateServiceRecordDto, admin: AuthenticatedAdmin): Promise<ServiceRecordView> {
    const vehicle = await this.vehicles.getById(input.vehicleId);
    if (input.mileageAtService < vehicle.currentMileage) {
      throw new BadRequestException('İşlem kilometresi aracın güncel kilometresinden küçük olamaz.');
    }
    if (input.nextMaintenanceMileage !== undefined && input.nextMaintenanceMileage <= input.mileageAtService) {
      throw new BadRequestException('Sonraki bakım kilometresi işlem kilometresinden büyük olmalıdır.');
    }
    const row = await this.records.create({
      vehicleId: input.vehicleId,
      type: input.type,
      serviceDate: new Date(input.serviceDate),
      mileageAtService: input.mileageAtService,
      performedWork: input.performedWork.trim(),
      ...(input.provider?.trim() ? { provider: input.provider.trim() } : {}),
      totalCost: input.totalCost,
      ...(input.note?.trim() ? { note: input.note.trim() } : {}),
      ...(input.nextMaintenanceMileage ? { nextMaintenanceMileage: input.nextMaintenanceMileage } : {}),
      createdById: admin.id,
      replacedParts: (input.replacedParts ?? []).map((part) => ({
        name: part.name.trim(), ...(part.note?.trim() ? { note: part.note.trim() } : {}),
      })),
    });
    return { ...row, totalCost: Number(row.totalCost) };
  }

  private filters(query: ListServiceRecordsQueryDto): Omit<ServiceRecordFilters, 'skip' | 'take'> {
    return {
      ...(query.vehicleId ? { vehicleId: query.vehicleId } : {}),
      ...(query.companyId ? { companyId: query.companyId } : {}),
      ...(query.unitId ? { unitId: query.unitId } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.dateFrom ? { dateFrom: new Date(`${query.dateFrom}T00:00:00.000Z`) } : {}),
      ...(query.dateTo ? { dateTo: new Date(`${query.dateTo}T23:59:59.999Z`) } : {}),
    };
  }
}
