export interface UnitRecord {
  id: string;
  name: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUnitInput {
  name: string;
  companyId: string;
}

export interface UpdateUnitInput {
  name: string;
}
