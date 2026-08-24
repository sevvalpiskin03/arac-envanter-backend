import { Module } from '@nestjs/common';
import { ADMIN_REPOSITORY } from './admin.repository';
import { PrismaAdminRepository } from './prisma-admin.repository';

@Module({
  providers: [
    PrismaAdminRepository,
    { provide: ADMIN_REPOSITORY, useExisting: PrismaAdminRepository },
  ],
  exports: [ADMIN_REPOSITORY],
})
export class AdminsModule {}
