import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { getByEmail, getById } from '../models/userModel.js';

function getCookieOptions(req) {
  const isProd = process.env.NODE_ENV === 'production';

  // Con Traefik, Express puede saber si era HTTPS gracias a `trust proxy`.
  const isSecureRequest = Boolean(req && req.secure) || String(req?.headers?.['x-forwarded-proto'] || '').includes('https');

  return {
    httpOnly: true,
    sameSite: 'strict',
    signed: true,
    // En produccion, obligamos cookies seguras (solo HTTPS).
    secure: isProd ? true : false,
  };
}

export const login = async (req, res, next) => {
  try {
    const { email, contrasena } = req.body;

    const user = await getByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // utilizamos la funcion de compare para ver si coinciden
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contrasena incorrecta' });
    }

    // utilizams la secret key definida en el .env para generar el token
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      const error = new Error('JWT_SECRET no configurado');
      error.status = 500;
      return next(error);
    }

    // ponemos en el token el id, el nickname, la clave secreta y su expiracion
    const token = jwt.sign(
      { id: user.id, nickname: user.nickname },
      secretKey,
      { expiresIn: '1h' }
    );

    // guardamos en la cookie el token
    res.cookie('access_token', token, getCookieOptions(req));

    return res.json({
      message: 'Login correct',
      user: { id: user.id, nickname: user.nickname },
    });
  } catch (error) {
    return next(error);
  }
};

// cerramos sesion
export const logout = (req, res) => {
  res.clearCookie('access_token', getCookieOptions(req));

  res.status(200).json({ message: 'Sesion cerrada correctamente' });
};

export const me = async (req, res, next) => {
  try {
    const id = req.user?.id;
    if (!id) {
      const error = new Error('No autenticado');
      error.status = 401;
      return next(error);
    }

    const user = await getById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { contrasena, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (error) {
    return next(error);
  }
};
