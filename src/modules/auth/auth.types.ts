import { PublicAdmin } from '../admins/admin.types';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthenticatedAdmin {
  id: string;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  admin: PublicAdmin;
}
