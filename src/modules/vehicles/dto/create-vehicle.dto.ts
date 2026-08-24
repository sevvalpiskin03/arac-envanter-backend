import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OwnerType } from '../../../generated/prisma/enums';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ example: '34 ABC 123' })
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  plate!: string;

  @ApiProperty({ example: 'Ford' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  brand!: string;

  @ApiProperty({ example: 'Transit' })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  model!: string;

  @ApiProperty({ example: 2022 })
  @IsInt({ message: 'Model yılı tam sayı olmalıdır.' })
  @Min(1950)
  @Max(2100)
  modelYear!: number;

  @ApiProperty({ example: 'Hafif Ticari' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  vehicleType!: string;

  @ApiProperty({ example: 84200 })
  @IsInt({ message: 'Kilometre tam sayı olmalıdır.' })
  @Min(0, { message: 'Kilometre negatif olamaz.' })
  currentMileage!: number;

  @ApiProperty({ enum: OwnerType, example: OwnerType.COMPANY })
  @IsEnum(OwnerType)
  ownerType!: OwnerType;

  @ApiProperty({ example: 'Aydın Lojistik A.Ş.' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  registeredOwner!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID('4', { message: 'Geçerli bir şirket seçiniz.' })
  companyId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID('4', { message: 'Geçerli bir birim seçiniz.' })
  unitId!: string;

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'HGS durumu doğru/yanlış olmalıdır.' })
  hasHgs!: boolean;

  @ApiPropertyOptional({ example: 80000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  lastMaintenanceMileage?: number;

  @ApiPropertyOptional({ example: 90000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  nextMaintenanceMileage?: number;

  @ApiPropertyOptional({ example: 'Araçla ilgili not' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
