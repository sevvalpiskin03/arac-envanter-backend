import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentAdmin } from '../auth/current-admin.decorator';
import type { AuthenticatedAdmin } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateServiceRecordDto } from './dto/create-service-record.dto';
import { ListServiceRecordsQueryDto } from './dto/list-service-records-query.dto';
import { ServiceRecordsService } from './service-records.service';

@ApiTags('Bakım ve Tamir Kayıtları')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('service-records')
export class ServiceRecordsController {
  constructor(private readonly serviceRecords: ServiceRecordsService) {}

  @Get()
  @ApiOperation({ summary: 'Bakım ve tamir kayıtlarını filtreli ve sayfalı listeler' })
  list(@Query() query: ListServiceRecordsQueryDto) { return this.serviceRecords.list(query); }

  @Post()
  @ApiOperation({ summary: 'Yeni bakım veya tamir kaydı ekler' })
  create(@Body() input: CreateServiceRecordDto, @CurrentAdmin() admin: AuthenticatedAdmin) {
    return this.serviceRecords.create(input, admin);
  }
}
