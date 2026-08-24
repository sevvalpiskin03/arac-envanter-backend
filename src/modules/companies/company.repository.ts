import type {
  CompanyRecord,
  CreateCompanyInput,
  UpdateCompanyInput,
} from './company.types';

export const COMPANY_REPOSITORY = Symbol('COMPANY_REPOSITORY');

export interface CompanyRepository {
  create(input: CreateCompanyInput): Promise<CompanyRecord>;
  findAll(): Promise<CompanyRecord[]>;
  findById(id: string): Promise<CompanyRecord | null>;
  findByName(name: string): Promise<CompanyRecord | null>;
  update(id: string, input: UpdateCompanyInput): Promise<CompanyRecord>;
}
