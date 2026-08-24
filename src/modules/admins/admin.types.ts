export interface AdminRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicAdmin = Omit<AdminRecord, 'passwordHash'>;

export interface CreateAdminInput {
  name: string;
  email: string;
  passwordHash: string;
}
