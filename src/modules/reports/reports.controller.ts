import { Controller, Get, Query, StreamableFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExportReportQueryDto } from './dto/export-report-query.dto';
import { ReportsService } from './reports.service';

@ApiTags('Raporlar') @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Controller('reports')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}
  @Get('excel') async excel(@Query() query: ExportReportQueryDto) {
    const buffer=await this.reports.exportWorkbook(query); const date=new Date().toISOString().slice(0,10);
    return new StreamableFile(buffer,{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',disposition:`attachment; filename="filo-raporu-${date}.xlsx"`});
  }
}
