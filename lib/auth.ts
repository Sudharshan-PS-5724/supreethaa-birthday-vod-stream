import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'sup_auth_session';

function getSecretKey() {
  const secret = process.env.SESSION_SECRET || 'default_supreethaa_birthday_secret_key_2026_xyz';
  return new TextEncoder().encode(secret);
}

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ auth: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getSecretKey());

  return token;
}

export async function verifySession(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return !!payload.auth;
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifySession(token);
}

export async function validatePassword(inputPassword: string): Promise<boolean> {
  const expected = process.env.APP_PASSWORD || 'supbirthday2026';
  return inputPassword.trim() === expected.trim();
}

export { COOKIE_NAME };
