import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ListVehiclesQueryDto } from './dto/list-vehicles-query.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import type { PaginatedVehicles, VehicleView } from './vehicle.types';
import { VehiclesService } from './vehicles.service';

@ApiTags('Araçlar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'Araç envanterini filtreli ve sayfalı listeler' })
  list(@Query() query: ListVehiclesQueryDto): Promise<PaginatedVehicles> {
    return this.vehiclesService.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Araç detayını getirir' })
  getById(@Param('id') id: string): Promise<VehicleView> {
    return this.vehiclesService.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Envantere yeni araç ekler' })
  create(@Body() input: CreateVehicleDto): Promise<VehicleView> {
    return this.vehiclesService.create(input);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Araç bilgilerini günceller' })
  update(@Param('id') id: string, @Body() input: UpdateVehicleDto): Promise<VehicleView> {
    return this.vehiclesService.update(id, input);
  }
}
