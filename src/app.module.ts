import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { validateEnvironment } from './config/environment.validation';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { UnitsModule } from './modules/units/units.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { ServiceRecordsModule } from './modules/service-records/service-records.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
    PrismaModule,
    AuthModule,
    CompaniesModule,
    UnitsModule,
    VehiclesModule,
    ServiceRecordsModule,
    HealthModule,
  ],
})
export class AppModule {}
