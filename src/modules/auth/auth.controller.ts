import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { PublicAdmin } from '../admins/admin.types';
import { AuthService } from './auth.service';
import type { AuthenticatedAdmin, LoginResponse } from './auth.types';
import { CurrentAdmin } from './current-admin.decorator';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Kimlik Doğrulama')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin hesabıyla giriş yapar' })
  login(@Body() input: LoginDto): Promise<LoginResponse> {
    return this.authService.login(input);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Giriş yapan adminin profilini döndürür' })
  getProfile(@CurrentAdmin() admin: AuthenticatedAdmin): Promise<PublicAdmin> {
    return this.authService.getProfile(admin.id);
  }
}
