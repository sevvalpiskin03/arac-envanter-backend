import type {
  CreateUnitInput,
  UnitRecord,
  UpdateUnitInput,
} from './unit.types';

export const UNIT_REPOSITORY = Symbol('UNIT_REPOSITORY');

export interface UnitRepository {
  create(input: CreateUnitInput): Promise<UnitRecord>;
  findByCompany(companyId: string): Promise<UnitRecord[]>;
  findByCompanyAndName(companyId: string, name: string): Promise<UnitRecord | null>;
  findById(id: string): Promise<UnitRecord | null>;
  update(id: string, input: UpdateUnitInput): Promise<UnitRecord>;
}
