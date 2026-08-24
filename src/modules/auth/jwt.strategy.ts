import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  ADMIN_REPOSITORY,
} from '../admins/admin.repository';
import type { AdminRepository } from '../admins/admin.repository';
import { AuthenticatedAdmin, JwtPayload } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @Inject(ADMIN_REPOSITORY) private readonly admins: AdminRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedAdmin> {
    const admin = await this.admins.findById(payload.sub);

    if (!admin || !admin.isActive || admin.email !== payload.email) {
      throw new UnauthorizedException('Oturum geçersiz veya süresi dolmuş.');
    }

    return { id: admin.id, email: admin.email };
  }
}
