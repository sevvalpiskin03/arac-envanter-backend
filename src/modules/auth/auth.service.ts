import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import {
  ADMIN_REPOSITORY,
} from '../admins/admin.repository';
import type { AdminRepository } from '../admins/admin.repository';
import type { AdminRecord, PublicAdmin } from '../admins/admin.types';
import { LoginDto } from './dto/login.dto';
import { JwtPayload, LoginResponse } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ADMIN_REPOSITORY)
    private readonly admins: AdminRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(input: LoginDto): Promise<LoginResponse> {
    const email = input.email.trim().toLowerCase();
    const admin = await this.admins.findByEmail(email);

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }

    const passwordMatches = await verify(admin.passwordHash, input.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }

    const payload: JwtPayload = { sub: admin.id, email: admin.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      tokenType: 'Bearer',
      admin: this.toPublicAdmin(admin),
    };
  }

  async getProfile(adminId: string): Promise<PublicAdmin> {
    const admin = await this.admins.findById(adminId);

    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Admin hesabı bulunamadı veya pasif.');
    }

    return this.toPublicAdmin(admin);
  }

  private toPublicAdmin(admin: AdminRecord): PublicAdmin {
    const { passwordHash: _passwordHash, ...publicAdmin } = admin;
    void _passwordHash;
    return publicAdmin;
  }
}
