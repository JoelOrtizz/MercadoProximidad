import { getUser, insertUser, deleteUserById, updateUserById } from '../models/userModel.js';

export const fetchUser = async (req, res, next) => {
  try {
    const users = await getUser();

    if (users.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ users });
  } catch (error) {
    return next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { nombre, nickname, email, contrasena } = req.body;

    const id = await insertUser(nombre, nickname, email, contrasena);

    return res.status(201).json({
      id,
      nombre,
      nickname,
      email,
      message: 'Usuario insertado con exito.',
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const paramId = req.params?.id;
    const authId = req.user?.id;
    const id = paramId ?? authId;

    if (!id) {
      const error = new Error('No autenticado.');
      error.status = 401;
      return next(error);
    }

    if (paramId && String(paramId) !== String(authId)) {
      const error = new Error('No autorizado.');
      error.status = 403;
      return next(error);
    }

    const result = await deleteUserById(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    return res.json({
      id,
      message: 'Usuario eliminado correctamente.',
    });
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const paramId = req.params?.id;
    const authId = req.user?.id;
    const id = paramId ?? authId;

    if (!id) {
      const error = new Error('No autenticado.');
      error.status = 401;
      return next(error);
    }

    if (paramId && String(paramId) !== String(authId)) {
      const error = new Error('No autorizado.');
      error.status = 403;
      return next(error);
    }

    const { nombre, nickname, email, contrasena } = req.body;
    const result = await updateUserById(id, nombre, nickname, email, contrasena);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    return res.json({
      id,
      nombre,
      nickname,
      email,
      message: 'Usuario actualizado correctamente.',
    });
  } catch (error) {
    return next(error);
  }
};

