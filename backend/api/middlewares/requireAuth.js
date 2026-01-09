import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function requireAuth(req, res, next) {
  try {
    const token = req.signedCookies?.access_token;
    if (!token) {
      const error = new Error('No autenticado');
      error.status = 401;
      return next(error);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      const error = new Error('JWT_SECRET no configurado');
      error.status = 500;
      return next(error);
    }

    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    return next();
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Token invalido o expirado');
    error.status = 401;
    return next(error);
  }
}
