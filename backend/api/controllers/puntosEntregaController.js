import { countPuntosEntregaByVendedor, createPuntoEntrega, createPuntosEntregaBulk, listPuntosEntregaByVendedor } from '../models/puntosEntregaModel.js';

// error
const badRequest = (message) => {
  const error = new Error(message);
  error.status = 400;
  return error;
};

const MAX_PUNTOS_ENTREGA = 5;

export const createPuntoEntregaHandler = async (req, res, next) => {
  try {
    // id del token como vendedor
    const vendedorId = req.user?.id;
    if (!vendedorId) {
      const error = new Error('No autenticado.');
      error.status = 401;
      throw error;
    }

    const total = await countPuntosEntregaByVendedor(vendedorId);
    if (total >= MAX_PUNTOS_ENTREGA) {
      throw badRequest(`Maximo ${MAX_PUNTOS_ENTREGA} puntos de entrega`);
    }

    const lat = Number(req.body?.lat);
    const lng = Number(req.body?.lng);
    // esto es la calle que se crea a partir de la funcion que hay en mapcontroller
    const descripcion = req.body?.descripcion ?? null;

    //comprobaciones
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw badRequest('lat y lng son obligatorios y numericos');
    }

    if (lat < -90 || lat > 90) {
      throw badRequest('lat fuera de rango (-90..90)');
    }

    if (lng < -180 || lng > 180) {
      throw badRequest('lng fuera de rango (-180..180)');
    }

    // funcion desde el model
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
    // id del token como vendedor
    const vendedorId = req.user?.id;
    if (!vendedorId) {
      const error = new Error("No autenticado.");
      error.status = 401;
      throw error;
    }
    // funcion desde el model
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

export const createPuntosEntregaBulkHandler = async (req, res, next) => {
  try {
    const vendedorId = req.user?.id;
    if (!vendedorId) {
      const error = new Error('No autenticado.');
      error.status = 401;
      throw error;
    }

    const puntos = Array.isArray(req.body?.puntos) ? req.body.puntos : null;
    if (!puntos || puntos.length === 0) {
      throw badRequest('puntos debe ser un array con al menos 1 elemento');
    }

    if (puntos.length > MAX_PUNTOS_ENTREGA) {
      throw badRequest(`Maximo ${MAX_PUNTOS_ENTREGA} puntos de entrega`);
    }

    const normalized = puntos.map((p, idx) => {
      const lat = Number(p?.lat);
      const lng = Number(p?.lng);
      const descripcion = p?.descripcion ?? null;

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        throw badRequest(`punto[${idx}]: lat y lng son obligatorios y numericos`);
      }

      if (lat < -90 || lat > 90) {
        throw badRequest(`punto[${idx}]: lat fuera de rango (-90..90)`);
      }

      if (lng < -180 || lng > 180) {
        throw badRequest(`punto[${idx}]: lng fuera de rango (-180..180)`);
      }

      return { lat, lng, descripcion };
    });

    const result = await createPuntosEntregaBulk({ vendedorId, puntos: normalized });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
