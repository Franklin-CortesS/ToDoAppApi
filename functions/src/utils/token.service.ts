import jwt from "jsonwebtoken";
import * as admin from "firebase-admin";
import {db} from "../firebase";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION = "1h";

/**
 * Generates a JWT token containing the provided email as payload.
 * @param {string} email - The email address to include in the token payload.
 * @return {string} A signed JWT token string with the email and expiration.
 */
export function generateToken(email: string): string {
  return jwt.sign({email}, JWT_SECRET, {expiresIn: JWT_EXPIRATION});
}

/**
 * Verifies a JWT token and extracts the email from its payload.
 * @param {string} token - The JWT token to verify.
 * @return {Object} An object containing the email extracted
 * from the token payload.
 * @throws {JsonWebTokenError} If the token is invalid or
 * verification fails.
 */
export function verifyToken(token: string): {email: string} {
  return jwt.verify(token, JWT_SECRET) as {email: string};
}

/**
 * Revokes a given token by adding it to the "tokenBlacklist"
 * collection in Firestore.
 * The token is stored as the document ID, and the revocation
 * time is set using the server timestamp.
 * @param {string} token - The token string to be revoked.
 * @return {Promise<void>} A promise that resolves when the
 * token has been successfully revoked.
 */
export async function revokeToken(token: string): Promise<void> {
  await db.collection("tokenBlacklist").add({
    token,
    revokedAt: admin.firestore.Timestamp.now(),
  });
}

/**
 * Checks if a given token has been revoked by verifying its existence in
 * the token blacklist collection.
 * @param {string} token - The token string to check for revocation.
 * @return {Promise<boolean>} A promise that resolves to `true` if the
 * token is revoked (exists in the blacklist), otherwise `false`.
 */
export async function isTokenRevoked(token: string): Promise<boolean> {
  const query = await db.collection("tokenBlacklist")
    .where("token", "==", token).limit(1).get();
  return !query.empty;
}
