import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import type { UnitRecord } from './unit.types';
import { UnitsService } from './units.service';

@ApiTags('Birimler')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get('companies/:companyId/units')
  @ApiOperation({ summary: 'Şirkete bağlı birimleri listeler' })
  listByCompany(@Param('companyId') companyId: string): Promise<UnitRecord[]> {
    return this.unitsService.listByCompany(companyId);
  }

  @Post('companies/:companyId/units')
  @ApiOperation({ summary: 'Şirkete yeni birim ekler' })
  create(
    @Param('companyId') companyId: string,
    @Body() input: CreateUnitDto,
  ): Promise<UnitRecord> {
    return this.unitsService.create(companyId, input);
  }

  @Get('units/:id')
  @ApiOperation({ summary: 'Birim detayını getirir' })
  getById(@Param('id') id: string): Promise<UnitRecord> {
    return this.unitsService.getById(id);
  }

  @Patch('units/:id')
  @ApiOperation({ summary: 'Birim adını günceller' })
  update(
    @Param('id') id: string,
    @Body() input: UpdateUnitDto,
  ): Promise<UnitRecord> {
    return this.unitsService.update(id, input);
  }
}
