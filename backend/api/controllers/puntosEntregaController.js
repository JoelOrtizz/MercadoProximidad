import { createPuntoEntrega, listPuntosEntregaByVendedor } from '../models/puntosEntregaModel.js';

const badRequest = (message) => {
  const error = new Error(message);
  error.status = 400;
  return error;
};

export const createPuntoEntregaHandler = async (req, res, next) => {
  try {
    const vendedorId = req.user?.id;
    if (!vendedorId) {
      const error = new Error('No autenticado.');
      error.status = 401;
      throw error;
    }

    const lat = Number(req.body?.lat);
    const lng = Number(req.body?.lng);
    const descripcion = req.body?.descripcion ?? null;

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw badRequest('lat y lng son obligatorios y numericos');
    }

    if (lat < -90 || lat > 90) {
      throw badRequest('lat fuera de rango (-90..90)');
    }

    if (lng < -180 || lng > 180) {
      throw badRequest('lng fuera de rango (-180..180)');
    }

    const created = await createPuntoEntrega({
      vendedorId,
      lat,
      lng,
      descripcion,
    });

    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const listMyPuntosEntrega = async (req, res, next) => {
  try {
    const vendedorId = req.user?.id;
    if (!vendedorId) {
      const error = new Error('No autenticado.');
      error.status = 401;
      throw error;
    }

    const rows = await listPuntosEntregaByVendedor(vendedorId);
    res.status(200).json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    next(error);
  }
};

export const listPuntosEntregaByUsuarioId = async (req, res, next) => {
  try {
    const usuarioId = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(usuarioId)) {
      throw badRequest('id de usuario invalido');
    }

    const rows = await listPuntosEntregaByVendedor(usuarioId);
    res.status(200).json(Array.isArray(rows) ? rows : []);
  } catch (error) {
    next(error);
  }
};
