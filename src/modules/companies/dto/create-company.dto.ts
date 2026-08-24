import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Aydın Lojistik A.Ş.' })
  @IsString({ message: 'Şirket adı metin olmalıdır.' })
  @MinLength(2, { message: 'Şirket adı en az 2 karakter olmalıdır.' })
  @MaxLength(150, { message: 'Şirket adı en fazla 150 karakter olmalıdır.' })
  name!: string;

  @ApiPropertyOptional({ example: 'Merkez şirket' })
  @IsOptional()
  @IsString({ message: 'Açıklama metin olmalıdır.' })
  @MaxLength(500, { message: 'Açıklama en fazla 500 karakter olmalıdır.' })
  note?: string;
}
