import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CompaniesController } from './companies.controller';
import { COMPANY_REPOSITORY } from './company.repository';
import { CompaniesService } from './companies.service';
import { PrismaCompanyRepository } from './prisma-company.repository';

@Module({
  imports: [AuthModule],
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    PrismaCompanyRepository,
    { provide: COMPANY_REPOSITORY, useExisting: PrismaCompanyRepository },
  ],
  exports: [CompaniesService, COMPANY_REPOSITORY],
})
export class CompaniesModule {}
