import { Request, Response } from 'express';
import { generateToken, revokeToken } from '../utils/token.service';

export function login(req: Request, res: Response) {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email inválido' });
  }

  const token = generateToken(email);
  return res.status(200).json({ token });
}

export async function logout(req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(400).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  await revokeToken(token);
  return res.json({ message: 'Token revocado exitosamente' });
}
