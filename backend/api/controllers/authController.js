import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { getByEmail, getById } from '../models/userModel.js';
import { insertLog } from '../models/logsModel.js';

function getCookieOptions(req) {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    sameSite: 'strict',
    signed: true,
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

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contrasena incorrecta' });
    }

    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      const error = new Error('JWT_SECRET no configurado');
      error.status = 500;
      return next(error);
    }

    const token = jwt.sign(
      { id: user.id, nickname: user.nickname },
      secretKey,
      { expiresIn: '1h' }
    );

    res.cookie('access_token', token, getCookieOptions(req));


    insertLog({
      userId: user.id,
      action: 'LOGGED',
      tableName: 'usuarios',
      data: { email: user.email, nickname: user.nickname },
    }).catch(() => {});

    return res.json({
      message: 'Login correct',
      user: { id: user.id, nickname: user.nickname },
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (req.user?.id) {
      insertLog({
        userId: req.user.id,
        action: 'LOGGED_OUT',
        tableName: 'usuarios',
        data: { nickname: req.user.nickname || null },
      }).catch(() => {});
    }

    res.clearCookie('access_token', getCookieOptions(req));
    return res.status(200).json({ message: 'Sesion cerrada correctamente' });
  } catch (error) {
    return next(error);
  }
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
