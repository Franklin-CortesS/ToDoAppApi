import jwt from 'jsonwebtoken';
import * as admin from 'firebase-admin';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const JWT_EXPIRATION = '1h';

export function generateToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export function verifyToken(token: string): { email: string } {
  return jwt.verify(token, JWT_SECRET) as { email: string };
}

export async function revokeToken(token: string): Promise<void> {
  const db = admin.firestore();
  await db.collection('tokenBlacklist').doc(token).set({
    revokedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

export async function isTokenRevoked(token: string): Promise<boolean> {
  const db = admin.firestore();
  const doc = await db.collection('tokenBlacklist').doc(token).get();
  return doc.exists;
}
