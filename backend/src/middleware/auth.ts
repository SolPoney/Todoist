import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

// On étend le type Request d'Express pour pouvoir y stocker l'userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// Middleware qui vérifie le token JWT sur chaque requête protégée
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // Le token doit être dans le header : "Authorization: Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token manquant' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = payload.userId; // On attache l'userId à la requête
    next(); // On passe à la suite (le controller)
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}
