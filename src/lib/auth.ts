import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

export const ADMIN_COOKIE_NAME = 'craftora_admin_session';

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || 'craftora-default-secret-key-change-in-production-min32';
  return new TextEncoder().encode(secret);
}

export interface AdminPayload {
  username: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

export async function signAdminToken(username: string): Promise<string> {
  const secretKey = getJwtSecretKey();
  return new SignJWT({ username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secretKey);
}

export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const secretKey = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.role === 'admin' && typeof payload.username === 'string') {
      return payload as unknown as AdminPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export function isCorrectAdminUsername(username: string): boolean {
  const expected = process.env.ADMIN_USERNAME || 'admin';
  return username === expected;
}

export async function getAdminSessionFromCookies(): Promise<AdminPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

export async function getAdminSessionFromRequest(request: Request | NextRequest): Promise<AdminPayload | null> {
  try {
    let token: string | undefined;
    if ('cookies' in request && typeof (request as any).cookies?.get === 'function') {
      token = (request as any).cookies.get(ADMIN_COOKIE_NAME)?.value;
    } else {
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(new RegExp(`(^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]*)`));
      token = match ? decodeURIComponent(match[2]) : undefined;
    }

    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return null;
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}
