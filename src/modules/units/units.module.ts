import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CompaniesModule } from '../companies/companies.module';
import { PrismaUnitRepository } from './prisma-unit.repository';
import { UNIT_REPOSITORY } from './unit.repository';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';

@Module({
  imports: [AuthModule, CompaniesModule],
  controllers: [UnitsController],
  providers: [
    UnitsService,
    PrismaUnitRepository,
    { provide: UNIT_REPOSITORY, useExisting: PrismaUnitRepository },
  ],
  exports: [UnitsService],
})
export class UnitsModule {}
