import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'alferoz-cleaning-jwt-secret-dev-2024';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string, username: string): string {
  return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): { userId: string; username: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
  } catch {
    return null;
  }
}

/**
 * Extract and verify JWT from Authorization header.
 * Returns the decoded payload or null if invalid.
 */
export function authenticateRequest(request: NextRequest): { userId: string; username: string } | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7);
  return verifyToken(token);
}
