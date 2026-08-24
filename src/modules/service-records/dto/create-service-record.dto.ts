import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ServiceType } from '../../../generated/prisma/enums';

export class ReplacedPartDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  note?: string;
}

export class CreateServiceRecordDto {
  @IsUUID()
  vehicleId!: string;

  @IsEnum(ServiceType)
  type!: ServiceType;

  @IsDateString()
  serviceDate!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  mileageAtService!: number;

  @IsString()
  @MaxLength(1000)
  performedWork!: string;

  @IsOptional()
  @IsString()
  @MaxLength(160)
  provider?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalCost!: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  nextMaintenanceMileage?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => ReplacedPartDto)
  replacedParts?: ReplacedPartDto[];
}
