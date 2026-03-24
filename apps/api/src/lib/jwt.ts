import { SignJWT, jwtVerify } from 'jose';

import { env } from '../env.js';

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
}

const secret = new TextEncoder().encode(env.JWT_SECRET);
const expirySeconds = env.JWT_EXPIRY_DAYS * 24 * 60 * 60;

export const signToken = async (payload: JwtPayload): Promise<string> =>
  new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${expirySeconds.toString()}s`)
    .sign(secret);

export const verifyToken = async (token: string): Promise<JwtPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (
      typeof payload.sub !== 'string' ||
      typeof payload['email'] !== 'string' ||
      typeof payload['role'] !== 'string'
    ) {
      return null;
    }
    return {
      sub: payload.sub,
      email: payload['email'],
      role: payload['role'] as JwtPayload['role'],
    };
  } catch {
    return null;
  }
};

export const COOKIE_NAME = 'auth_token';
export const COOKIE_MAX_AGE = expirySeconds;
