import { db } from '@/db';
import { loginAttempts } from '@/db/schema';
import { and, eq, gte, sql } from 'drizzle-orm';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MINUTES = 15;

export interface LockoutStatus {
  locked: boolean;
  remainingMinutes?: number;
  remainingSeconds?: number;
  message?: string;
}

export async function checkBruteForceLockout(ip: string): Promise<LockoutStatus> {
  try {
    const windowStart = new Date(Date.now() - LOCKOUT_WINDOW_MINUTES * 60 * 1000);

    const failedAttempts = await db
      .select({
        attemptedAt: loginAttempts.attemptedAt,
      })
      .from(loginAttempts)
      .where(
        and(
          eq(loginAttempts.ip, ip),
          eq(loginAttempts.success, false),
          gte(loginAttempts.attemptedAt, windowStart)
        )
      )
      .orderBy(sql`${loginAttempts.attemptedAt} DESC`);

    if (failedAttempts.length >= MAX_FAILED_ATTEMPTS) {
      // Find the oldest of the last 5 attempts within window to calculate unlock time
      const fifthAttempt = failedAttempts[MAX_FAILED_ATTEMPTS - 1];
      const unlockTime = new Date(fifthAttempt.attemptedAt.getTime() + LOCKOUT_WINDOW_MINUTES * 60 * 1000);
      const remainingMs = Math.max(0, unlockTime.getTime() - Date.now());
      const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));
      const remainingSeconds = Math.ceil(remainingMs / 1000);

      return {
        locked: true,
        remainingMinutes,
        remainingSeconds,
        message: `Too many failed login attempts. Account locked. Please try again in ${remainingMinutes} minute(s).`,
      };
    }

    return { locked: false };
  } catch (error) {
    console.error('Error checking brute force lockout:', error);
    // In case of transient DB error, do not completely lock out, but fail open/safely
    return { locked: false };
  }
}

export async function recordLoginAttempt(ip: string, success: boolean): Promise<void> {
  try {
    await db.insert(loginAttempts).values({
      ip,
      success,
    });
  } catch (error) {
    console.error('Error recording login attempt:', error);
  }
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
