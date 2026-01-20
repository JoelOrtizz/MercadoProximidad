import { getUnidades } from '../models/unidadesModel.js';

export async function fetchUnidades(req, res, next) {
  try {
    const rows = await getUnidades();
    res.status(200).json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    next(error);
  }
}

