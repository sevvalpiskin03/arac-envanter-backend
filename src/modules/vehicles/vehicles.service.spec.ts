import { BadRequestException, ConflictException } from '@nestjs/common';
import { OwnerType } from '../../generated/prisma/enums';
import { CompaniesService } from '../companies/companies.service';
import { UnitsService } from '../units/units.service';
import type { VehicleRepository } from './vehicle.repository';
import { MaintenanceStatus, type VehicleRecordWithRelations } from './vehicle.types';
import { VehiclesService } from './vehicles.service';

describe('VehiclesService', () => {
  const vehicle: VehicleRecordWithRelations = {
    id: 'vehicle-1',
    plate: '34 ABC 123',
    brand: 'Ford',
    model: 'Transit',
    modelYear: 2022,
    vehicleType: 'Hafif Ticari',
    currentMileage: 84200,
    ownerType: OwnerType.COMPANY,
    registeredOwner: 'Aydın Lojistik A.Ş.',
    companyId: 'company-1',
    unitId: 'unit-1',
    hasHgs: true,
    lastMaintenanceMileage: 80000,
    nextMaintenanceMileage: 85000,
    note: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
    company: { id: 'company-1', name: 'Aydın Lojistik A.Ş.' },
    unit: { id: 'unit-1', name: 'Lojistik' },
  };

  const repository: jest.Mocked<VehicleRepository> = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByPlate: jest.fn(),
    update: jest.fn(),
  };
  const getCompanyById = jest.fn();
  const getUnitById = jest.fn();
  const companiesService = { getById: getCompanyById } as unknown as CompaniesService;
  const unitsService = { getById: getUnitById } as unknown as UnitsService;
  let service: VehiclesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new VehiclesService(repository, companiesService, unitsService);
    getCompanyById.mockResolvedValue(vehicle.company);
    getUnitById.mockResolvedValue({ ...vehicle.unit, companyId: vehicle.companyId });
  });

  it('plakayı normalize ederek aracı oluşturur', async () => {
    repository.findByPlate.mockResolvedValue(null);
    repository.create.mockResolvedValue(vehicle);

    const result = await service.create({
      plate: ' 34 abc   123 ',
      brand: 'Ford',
      model: 'Transit',
      modelYear: 2022,
      vehicleType: 'Hafif Ticari',
      currentMileage: 84200,
      ownerType: OwnerType.COMPANY,
      registeredOwner: 'Aydın Lojistik A.Ş.',
      companyId: vehicle.companyId,
      unitId: vehicle.unitId,
      hasHgs: true,
      lastMaintenanceMileage: 80000,
      nextMaintenanceMileage: 85000,
    });

    expect(repository.create.mock.calls[0]?.[0].plate).toBe('34 ABC 123');
    expect(result.maintenanceStatus).toBe(MaintenanceStatus.APPROACHING);
    expect(result.remainingMaintenanceMileage).toBe(800);
  });

  it('yinelenen plakayı kabul etmez', async () => {
    repository.findByPlate.mockResolvedValue(vehicle);

    await expect(
      service.create({
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        modelYear: vehicle.modelYear,
        vehicleType: vehicle.vehicleType,
        currentMileage: vehicle.currentMileage,
        ownerType: vehicle.ownerType,
        registeredOwner: vehicle.registeredOwner,
        companyId: vehicle.companyId,
        unitId: vehicle.unitId,
        hasHgs: vehicle.hasHgs,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('başka şirkete ait birimi kabul etmez', async () => {
    repository.findByPlate.mockResolvedValue(null);
    getUnitById.mockResolvedValue({ ...vehicle.unit, companyId: 'company-2' });

    await expect(
      service.create({
        plate: '34 XYZ 456',
        brand: vehicle.brand,
        model: vehicle.model,
        modelYear: vehicle.modelYear,
        vehicleType: vehicle.vehicleType,
        currentMileage: vehicle.currentMileage,
        ownerType: vehicle.ownerType,
        registeredOwner: vehicle.registeredOwner,
        companyId: vehicle.companyId,
        unitId: vehicle.unitId,
        hasHgs: false,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('bakım durumuna göre filtreleyip sayfalar', async () => {
    repository.findAll.mockResolvedValue([
      vehicle,
      { ...vehicle, id: 'vehicle-2', plate: '34 DEF 456', currentMileage: 86000 },
    ]);

    const result = await service.list({
      page: 1,
      limit: 20,
      maintenanceStatus: MaintenanceStatus.OVERDUE,
    });

    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.plate).toBe('34 DEF 456');
    expect(result.pagination.total).toBe(1);
  });
});
