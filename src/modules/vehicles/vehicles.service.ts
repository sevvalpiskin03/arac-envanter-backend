import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';
import { UnitsService } from '../units/units.service';
import type { CreateVehicleDto } from './dto/create-vehicle.dto';
import type { ListVehiclesQueryDto } from './dto/list-vehicles-query.dto';
import type { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VEHICLE_REPOSITORY } from './vehicle.repository';
import type { VehicleRepository } from './vehicle.repository';
import {
  MaintenanceStatus,
  type CreateVehicleInput,
  type PaginatedVehicles,
  type UpdateVehicleInput,
  type VehicleRecordWithRelations,
  type VehicleView,
} from './vehicle.types';

const DEFAULT_WARNING_MILEAGE = 1000;

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicles: VehicleRepository,
    private readonly companiesService: CompaniesService,
    private readonly unitsService: UnitsService,
  ) {}

  async list(query: ListVehiclesQueryDto): Promise<PaginatedVehicles> {
    const records = await this.vehicles.findAll({
      ...(query.search?.trim() ? { search: query.search.trim() } : {}),
      ...(query.companyId ? { companyId: query.companyId } : {}),
      ...(query.unitId ? { unitId: query.unitId } : {}),
      ...(query.hasHgs !== undefined ? { hasHgs: query.hasHgs } : {}),
    });
    const views = records
      .map((record) => this.toView(record))
      .filter(
        (vehicle) =>
          !query.maintenanceStatus ||
          vehicle.maintenanceStatus === query.maintenanceStatus,
      );
    const total = views.length;
    const start = (query.page - 1) * query.limit;

    return {
      data: views.slice(start, start + query.limit),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    };
  }

  async getById(id: string): Promise<VehicleView> {
    const vehicle = await this.vehicles.findById(id);

    if (!vehicle) {
      throw new NotFoundException('Araç bulunamadı.');
    }

    return this.toView(vehicle);
  }

  async create(input: CreateVehicleDto): Promise<VehicleView> {
    const plate = this.normalizePlate(input.plate);

    if (await this.vehicles.findByPlate(plate)) {
      throw new ConflictException('Bu plakaya sahip bir araç zaten kayıtlı.');
    }

    await this.validateCompanyAndUnit(input.companyId, input.unitId);
    this.validateMaintenanceMileage(
      input.currentMileage,
      input.lastMaintenanceMileage,
      input.nextMaintenanceMileage,
    );

    const data: CreateVehicleInput = {
      plate,
      brand: input.brand.trim(),
      model: input.model.trim(),
      modelYear: input.modelYear,
      vehicleType: input.vehicleType.trim(),
      currentMileage: input.currentMileage,
      ownerType: input.ownerType,
      registeredOwner: input.registeredOwner.trim(),
      companyId: input.companyId,
      unitId: input.unitId,
      hasHgs: input.hasHgs,
      ...(input.lastMaintenanceMileage !== undefined
        ? { lastMaintenanceMileage: input.lastMaintenanceMileage }
        : {}),
      ...(input.nextMaintenanceMileage !== undefined
        ? { nextMaintenanceMileage: input.nextMaintenanceMileage }
        : {}),
      ...(input.note?.trim() ? { note: input.note.trim() } : {}),
    };

    return this.toView(await this.vehicles.create(data));
  }

  async update(id: string, input: UpdateVehicleDto): Promise<VehicleView> {
    const current = await this.getById(id);
    const changes: UpdateVehicleInput = {};
    const plate = input.plate ? this.normalizePlate(input.plate) : current.plate;

    if (plate !== current.plate) {
      const vehicleWithPlate = await this.vehicles.findByPlate(plate);
      if (vehicleWithPlate && vehicleWithPlate.id !== id) {
        throw new ConflictException('Bu plakaya sahip bir araç zaten kayıtlı.');
      }
      changes.plate = plate;
    }

    const companyId = input.companyId ?? current.companyId;
    const unitId = input.unitId ?? current.unitId;
    if (input.companyId || input.unitId) {
      await this.validateCompanyAndUnit(companyId, unitId);
    }

    const currentMileage = input.currentMileage ?? current.currentMileage;
    const lastMaintenanceMileage =
      input.lastMaintenanceMileage ?? current.lastMaintenanceMileage ?? undefined;
    const nextMaintenanceMileage =
      input.nextMaintenanceMileage ?? current.nextMaintenanceMileage ?? undefined;
    this.validateMaintenanceMileage(
      currentMileage,
      lastMaintenanceMileage,
      nextMaintenanceMileage,
    );

    this.assignText(changes, 'brand', input.brand);
    this.assignText(changes, 'model', input.model);
    this.assignText(changes, 'vehicleType', input.vehicleType);
    this.assignText(changes, 'registeredOwner', input.registeredOwner);
    if (input.modelYear !== undefined) changes.modelYear = input.modelYear;
    if (input.currentMileage !== undefined) changes.currentMileage = input.currentMileage;
    if (input.ownerType !== undefined) changes.ownerType = input.ownerType;
    if (input.companyId !== undefined) changes.companyId = input.companyId;
    if (input.unitId !== undefined) changes.unitId = input.unitId;
    if (input.hasHgs !== undefined) changes.hasHgs = input.hasHgs;
    if (input.lastMaintenanceMileage !== undefined) {
      changes.lastMaintenanceMileage = input.lastMaintenanceMileage;
    }
    if (input.nextMaintenanceMileage !== undefined) {
      changes.nextMaintenanceMileage = input.nextMaintenanceMileage;
    }
    if (input.note !== undefined) changes.note = input.note.trim() || null;

    if (Object.keys(changes).length === 0) {
      throw new BadRequestException('Güncellenecek en az bir alan gönderiniz.');
    }

    return this.toView(await this.vehicles.update(id, changes));
  }

  private async validateCompanyAndUnit(companyId: string, unitId: string): Promise<void> {
    await this.companiesService.getById(companyId);
    const unit = await this.unitsService.getById(unitId);

    if (unit.companyId !== companyId) {
      throw new BadRequestException('Seçilen birim bu şirkete bağlı değil.');
    }
  }

  private validateMaintenanceMileage(
    currentMileage: number,
    lastMaintenanceMileage?: number,
    nextMaintenanceMileage?: number,
  ): void {
    if (lastMaintenanceMileage !== undefined && lastMaintenanceMileage > currentMileage) {
      throw new BadRequestException('Son bakım kilometresi güncel kilometreden büyük olamaz.');
    }
    if (nextMaintenanceMileage !== undefined && nextMaintenanceMileage <= currentMileage) {
      throw new BadRequestException('Sonraki bakım kilometresi güncel kilometreden büyük olmalıdır.');
    }
  }

  private normalizePlate(plate: string): string {
    return plate.trim().replace(/\s+/g, ' ').toLocaleUpperCase('tr-TR');
  }

  private assignText(
    target: UpdateVehicleInput,
    key: 'brand' | 'model' | 'vehicleType' | 'registeredOwner',
    value?: string,
  ): void {
    if (value !== undefined) target[key] = value.trim();
  }

  private toView(vehicle: VehicleRecordWithRelations): VehicleView {
    const nextMileage = vehicle.nextMaintenanceMileage;
    if (nextMileage === null) {
      return {
        ...vehicle,
        maintenanceStatus: MaintenanceStatus.NOT_PLANNED,
        remainingMaintenanceMileage: null,
      };
    }

    const remaining = nextMileage - vehicle.currentMileage;
    const maintenanceStatus =
      remaining < 0
        ? MaintenanceStatus.OVERDUE
        : remaining <= DEFAULT_WARNING_MILEAGE
          ? MaintenanceStatus.APPROACHING
          : MaintenanceStatus.NORMAL;

    return {
      ...vehicle,
      maintenanceStatus,
      remainingMaintenanceMileage: remaining,
    };
  }
}
