import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function requireAuth(req, res, next) {
  try {
    // acces_token es el nombre del token que cuando es firmado se guarda como signedCookie y usamos la variable token
    // para guardar la informaciond el token
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

    // verifica que el token tenga la clave secreta
    const payload = jwt.verify(token, jwtSecret);
    // saca el id del token
    req.user = payload; // id + nickname
    return next();
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Token invalido o expirado');
    error.status = 401;
    return next(error);
  }
}
