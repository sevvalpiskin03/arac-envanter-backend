import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CompaniesModule } from '../companies/companies.module';
import { UnitsModule } from '../units/units.module';
import { PrismaVehicleRepository } from './prisma-vehicle.repository';
import { VEHICLE_REPOSITORY } from './vehicle.repository';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
  imports: [AuthModule, CompaniesModule, UnitsModule],
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    PrismaVehicleRepository,
    { provide: VEHICLE_REPOSITORY, useExisting: PrismaVehicleRepository },
  ],
})
export class VehiclesModule {}
