import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AdminRepository } from './admin.repository';
import { AdminRecord, CreateAdminInput } from './admin.types';

@Injectable()
export class PrismaAdminRepository implements AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  count(): Promise<number> {
    return this.prisma.admin.count();
  }

  create(input: CreateAdminInput): Promise<AdminRecord> {
    return this.prisma.admin.create({ data: input });
  }

  findByEmail(email: string): Promise<AdminRecord | null> {
    return this.prisma.admin.findUnique({ where: { email } });
  }

  findById(id: string): Promise<AdminRecord | null> {
    return this.prisma.admin.findUnique({ where: { id } });
  }
}
