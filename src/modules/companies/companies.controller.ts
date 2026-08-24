import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompaniesService } from './companies.service';
import type { CompanyRecord } from './company.types';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('Şirketler')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'Tüm şirketleri listeler' })
  list(): Promise<CompanyRecord[]> {
    return this.companiesService.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Şirket detayını getirir' })
  getById(@Param('id') id: string): Promise<CompanyRecord> {
    return this.companiesService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yeni şirket oluşturur' })
  create(@Body() input: CreateCompanyDto): Promise<CompanyRecord> {
    return this.companiesService.create(input);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Şirket bilgilerini günceller' })
  update(
    @Param('id') id: string,
    @Body() input: UpdateCompanyDto,
  ): Promise<CompanyRecord> {
    return this.companiesService.update(id, input);
  }
}
