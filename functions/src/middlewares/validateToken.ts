import { Request, Response, NextFunction } from 'express';
import { verifyToken, isTokenRevoked } from '../utils/token.service';

export async function verifyAuthToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const revoked = await isTokenRevoked(token);
    if (revoked) return res.status(401).json({ error: 'Token revocado' });

    const payload = verifyToken(token);
    req.body.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
