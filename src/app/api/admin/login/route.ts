import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations';
import {
  isCorrectAdminUsername,
  signAdminToken,
  ADMIN_COOKIE_NAME,
} from '@/lib/auth';
import { verifyAdminCredentials } from '@/lib/password';
import {
  getClientIp,
  checkBruteForceLockout,
  recordLoginAttempt,
} from '@/lib/brute-force';

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // 1. Check brute force lockout
    const lockout = await checkBruteForceLockout(ip);
    if (lockout.locked) {
      return NextResponse.json(
        { error: lockout.message || 'Account temporarily locked. Please try again later.' },
        { status: 429 }
      );
    }

    // 2. Validate request body
    const body = await request.json();
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 400 }
      );
    }

    const { username, password } = validation.data;

    // 3. Verify credentials
    const isUserValid = isCorrectAdminUsername(username);
    const isPassValid = await verifyAdminCredentials(password);

    if (!isUserValid || !isPassValid) {
      await recordLoginAttempt(ip, false);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 4. Successful login
    await recordLoginAttempt(ip, true);
    const token = await signAdminToken(username);

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected authentication error occurred' },
      { status: 500 }
    );
  }
}
