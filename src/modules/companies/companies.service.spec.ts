import { ConflictException, NotFoundException } from '@nestjs/common';
import type { CompanyRepository } from './company.repository';
import { CompaniesService } from './companies.service';
import type { CompanyRecord } from './company.types';

describe('CompaniesService', () => {
  const company: CompanyRecord = {
    id: 'company-1',
    name: 'Aydın Lojistik A.Ş.',
    note: null,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  const repository: jest.Mocked<CompanyRepository> = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
  };

  let service: CompaniesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CompaniesService(repository);
  });

  it('şirket adını ve açıklamasını temizleyerek oluşturur', async () => {
    repository.findByName.mockResolvedValue(null);
    repository.create.mockResolvedValue(company);

    await service.create({ name: '  Aydın Lojistik A.Ş.  ', note: ' Merkez ' });

    expect(repository.create.mock.calls[0]?.[0]).toEqual({
      name: 'Aydın Lojistik A.Ş.',
      note: 'Merkez',
    });
  });

  it('yinelenen şirket adını kabul etmez', async () => {
    repository.findByName.mockResolvedValue(company);

    await expect(service.create({ name: company.name })).rejects.toThrow(
      ConflictException,
    );
  });

  it('bulunamayan şirket için hata döndürür', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.getById('missing')).rejects.toThrow(NotFoundException);
  });
});
