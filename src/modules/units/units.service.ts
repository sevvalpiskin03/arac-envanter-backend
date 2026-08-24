import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompaniesService } from '../companies/companies.service';
import type { CreateUnitDto } from './dto/create-unit.dto';
import type { UpdateUnitDto } from './dto/update-unit.dto';
import { UNIT_REPOSITORY } from './unit.repository';
import type { UnitRepository } from './unit.repository';
import type { UnitRecord } from './unit.types';

@Injectable()
export class UnitsService {
  constructor(
    @Inject(UNIT_REPOSITORY)
    private readonly units: UnitRepository,
    private readonly companiesService: CompaniesService,
  ) {}

  async listByCompany(companyId: string): Promise<UnitRecord[]> {
    await this.companiesService.getById(companyId);
    return this.units.findByCompany(companyId);
  }

  async getById(id: string): Promise<UnitRecord> {
    const unit = await this.units.findById(id);

    if (!unit) {
      throw new NotFoundException('Birim bulunamadı.');
    }

    return unit;
  }

  async create(companyId: string, input: CreateUnitDto): Promise<UnitRecord> {
    await this.companiesService.getById(companyId);
    const name = input.name.trim();

    if (await this.units.findByCompanyAndName(companyId, name)) {
      throw new ConflictException('Bu şirkette aynı isimde bir birim var.');
    }

    return this.units.create({ companyId, name });
  }

  async update(id: string, input: UpdateUnitDto): Promise<UnitRecord> {
    const current = await this.getById(id);
    const name = input.name.trim();
    const unitWithName = await this.units.findByCompanyAndName(
      current.companyId,
      name,
    );

    if (unitWithName && unitWithName.id !== current.id) {
      throw new ConflictException('Bu şirkette aynı isimde bir birim var.');
    }

    return this.units.update(id, { name });
  }
}
