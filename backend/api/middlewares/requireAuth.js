import jwt from 'jsonwebtoken';
import 'dotenv/config';

export function requireAuth(req, res, next) {
  try {
    // acces_token es el nombre del token que cuando es firmado se guarda como signedCookie y usamos la variable token
    // para guardar la informaciond el token
    const token = req.signedCookies && req.signedCookies.access_token ? req.signedCookies.access_token : null;
    if (!token) {
      // Esto NO es un error "raro": simplemente el usuario no esta logueado.
      // Si lo mandamos al manejador global, se llena el log con stack traces.
      return res.status(401).json({ error: 'No autenticado' });
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
    req.user = payload;
    return next();
  } catch (err) {
    // Token mal o expirado -> 401 sin pasar por el handler global (evitamos spam de logs)
    return res.status(401).json({ error: 'Token invalido o expirado' });
  }
}
