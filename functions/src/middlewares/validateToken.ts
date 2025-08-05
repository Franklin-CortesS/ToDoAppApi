import {Request, Response, NextFunction} from "express";
import {verifyToken, isTokenRevoked} from "../utils/token.service";

/**
 * Middleware to verify the authentication token from the
 * request headers. Checks for a Bearer token in the
 * `Authorization` header, validates if the token is revoked,
 * and verifies its authenticity. If valid, attaches the
 * decoded payload to `req.body.user`
 * and calls the next middleware. Otherwise, responds with a
 * 401 status and an appropriate error message.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @return {void} Responds with 401 if the token is missing, revoked,
 * invalid, or expired; otherwise, proceeds to the next middleware.
 */
export async function verifyAuthToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({error: "Token no proporcionado"});
  }

  const token = authHeader.split(" ")[1];

  try {
    const revoked = await isTokenRevoked(token);
    if (revoked) return res.status(401).json({error: "Token revocado"});

    const payload = verifyToken(token);
    req.headers.x_email = payload.email;
    return next();
  } catch (error) {
    return res.status(401).json({error: "Token inválido o expirado"});
  }
}
