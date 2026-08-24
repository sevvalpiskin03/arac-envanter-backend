import { ConflictException } from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';
import type { CompanyRecord } from '../companies/company.types';
import type { UnitRepository } from './unit.repository';
import type { UnitRecord } from './unit.types';
import { UnitsService } from './units.service';

describe('UnitsService', () => {
  const company: CompanyRecord = {
    id: 'company-1',
    name: 'Aydın Lojistik A.Ş.',
    note: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  const unit: UnitRecord = {
    id: 'unit-1',
    companyId: company.id,
    name: 'Lojistik',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  const repository: jest.Mocked<UnitRepository> = {
    create: jest.fn(),
    findByCompany: jest.fn(),
    findByCompanyAndName: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  const getCompanyById = jest.fn<Promise<CompanyRecord>, [string]>();
  const companiesService = {
    getById: getCompanyById,
  } as unknown as CompaniesService;

  let service: UnitsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UnitsService(repository, companiesService);
  });

  it('birimi doğrulanmış şirkete bağlayarak oluşturur', async () => {
    getCompanyById.mockResolvedValue(company);
    repository.findByCompanyAndName.mockResolvedValue(null);
    repository.create.mockResolvedValue(unit);

    await service.create(company.id, { name: '  Lojistik ' });

    expect(repository.create.mock.calls[0]?.[0]).toEqual({
      companyId: company.id,
      name: 'Lojistik',
    });
  });

  it('aynı şirkette yinelenen birim adını kabul etmez', async () => {
    getCompanyById.mockResolvedValue(company);
    repository.findByCompanyAndName.mockResolvedValue(unit);

    await expect(
      service.create(company.id, { name: unit.name }),
    ).rejects.toThrow(ConflictException);
  });

  it('başka birimin kullandığı ada güncellemeyi engeller', async () => {
    repository.findById.mockResolvedValue(unit);
    repository.findByCompanyAndName.mockResolvedValue({
      ...unit,
      id: 'unit-2',
    });

    await expect(service.update(unit.id, { name: 'Satış' })).rejects.toThrow(
      ConflictException,
    );
  });
});
