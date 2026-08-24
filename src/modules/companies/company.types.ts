export interface CompanyRecord {
  id: string;
  name: string;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyInput {
  name: string;
  note?: string;
}

export interface UpdateCompanyInput {
  name?: string;
  note?: string | null;
}
