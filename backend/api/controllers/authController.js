import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { getByEmail } from '../models/userModel.js';

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

    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      signed: true,
    });

    return res.json({
      message: 'Login correct',
      user: { id: user.id, nickname: user.nickname },
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    sameSite: 'strict',
    signed: true,
  });

  res.status(200).json({ message: 'Sesion cerrada correctamente' });
};
