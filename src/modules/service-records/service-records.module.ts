import { Module } from '@nestjs/common';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { PrismaServiceRecordRepository } from './prisma-service-record.repository';
import { SERVICE_RECORD_REPOSITORY } from './service-record.repository';
import { ServiceRecordsController } from './service-records.controller';
import { ServiceRecordsService } from './service-records.service';

@Module({
  imports: [VehiclesModule],
  controllers: [ServiceRecordsController],
  providers: [ServiceRecordsService, { provide: SERVICE_RECORD_REPOSITORY, useClass: PrismaServiceRecordRepository }],
})
export class ServiceRecordsModule {}
