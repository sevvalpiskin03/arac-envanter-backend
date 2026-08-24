import { CreateAdminInput, AdminRecord } from './admin.types';

export const ADMIN_REPOSITORY = Symbol('ADMIN_REPOSITORY');

export interface AdminRepository {
  count(): Promise<number>;
  create(input: CreateAdminInput): Promise<AdminRecord>;
  findByEmail(email: string): Promise<AdminRecord | null>;
  findById(id: string): Promise<AdminRecord | null>;
}
