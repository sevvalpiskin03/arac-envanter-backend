import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type { CompanyRepository } from './company.repository';
import type {
  CompanyRecord,
  CreateCompanyInput,
  UpdateCompanyInput,
} from './company.types';

@Injectable()
export class PrismaCompanyRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateCompanyInput): Promise<CompanyRecord> {
    return this.prisma.company.create({ data: input });
  }

  findAll(): Promise<CompanyRecord[]> {
    return this.prisma.company.findMany({ orderBy: { name: 'asc' } });
  }

  findById(id: string): Promise<CompanyRecord | null> {
    return this.prisma.company.findUnique({ where: { id } });
  }

  findByName(name: string): Promise<CompanyRecord | null> {
    return this.prisma.company.findUnique({ where: { name } });
  }

  update(id: string, input: UpdateCompanyInput): Promise<CompanyRecord> {
    return this.prisma.company.update({ where: { id }, data: input });
  }
}
