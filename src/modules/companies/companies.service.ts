import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  COMPANY_REPOSITORY,
} from './company.repository';
import type { CompanyRepository } from './company.repository';
import type { CompanyRecord, UpdateCompanyInput } from './company.types';
import type { CreateCompanyDto } from './dto/create-company.dto';
import type { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companies: CompanyRepository,
  ) {}

  list(): Promise<CompanyRecord[]> {
    return this.companies.findAll();
  }

  async getById(id: string): Promise<CompanyRecord> {
    const company = await this.companies.findById(id);

    if (!company) {
      throw new NotFoundException('Şirket bulunamadı.');
    }

    return company;
  }

  async create(input: CreateCompanyDto): Promise<CompanyRecord> {
    const name = input.name.trim();

    if (await this.companies.findByName(name)) {
      throw new ConflictException('Bu şirket adı zaten kullanılıyor.');
    }

    return this.companies.create({
      name,
      ...(input.note?.trim() ? { note: input.note.trim() } : {}),
    });
  }

  async update(id: string, input: UpdateCompanyDto): Promise<CompanyRecord> {
    const current = await this.getById(id);
    const changes: UpdateCompanyInput = {};

    if (input.name !== undefined) {
      const name = input.name.trim();
      const companyWithName = await this.companies.findByName(name);

      if (companyWithName && companyWithName.id !== current.id) {
        throw new ConflictException('Bu şirket adı zaten kullanılıyor.');
      }
      changes.name = name;
    }

    if (input.note !== undefined) {
      changes.note = input.note.trim() || null;
    }

    if (Object.keys(changes).length === 0) {
      throw new BadRequestException('Güncellenecek en az bir alan gönderiniz.');
    }

    return this.companies.update(id, changes);
  }
}
