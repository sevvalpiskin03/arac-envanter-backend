import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz.' })
  email!: string;

  @ApiProperty({ example: 'guclu-bir-parola', minLength: 8 })
  @IsString({ message: 'Şifre metin olmalıdır.' })
  @MinLength(8, { message: 'Şifre en az 8 karakter olmalıdır.' })
  password!: string;
}
