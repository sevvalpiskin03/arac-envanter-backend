import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUnitDto {
  @ApiProperty({ example: 'Lojistik' })
  @IsString({ message: 'Birim adı metin olmalıdır.' })
  @MinLength(2, { message: 'Birim adı en az 2 karakter olmalıdır.' })
  @MaxLength(100, { message: 'Birim adı en fazla 100 karakter olmalıdır.' })
  name!: string;
}
