import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'argon2';
import { AdminRepository } from '../admins/admin.repository';
import { AdminRecord } from '../admins/admin.types';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const admin: AdminRecord = {
    id: 'admin-id',
    name: 'Elif Kaya',
    email: 'admin@example.com',
    passwordHash: '',
    isActive: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  };

  const repository: jest.Mocked<AdminRepository> = {
    count: jest.fn(),
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
  };

  const jwtService = {
    signAsync: jest.fn().mockResolvedValue('signed-token'),
  } as unknown as JwtService;

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(repository, jwtService);
  });

  it('geçerli bilgilerle token ve güvenli admin profili döndürür', async () => {
    repository.findByEmail.mockResolvedValue({
      ...admin,
      passwordHash: await hash('guclu-parola-123'),
    });

    const result = await service.login({
      email: 'ADMIN@example.com ',
      password: 'guclu-parola-123',
    });

    expect(repository.findByEmail.mock.calls[0]).toEqual(['admin@example.com']);
    expect(result.accessToken).toBe('signed-token');
    expect(result.admin).not.toHaveProperty('passwordHash');
  });

  it('hatalı şifre için genel bir yetkisiz hatası döndürür', async () => {
    repository.findByEmail.mockResolvedValue({
      ...admin,
      passwordHash: await hash('dogru-parola-123'),
    });

    await expect(
      service.login({ email: admin.email, password: 'yanlis-parola' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('pasif adminin profilini döndürmez', async () => {
    repository.findById.mockResolvedValue({ ...admin, isActive: false });

    await expect(service.getProfile(admin.id)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
