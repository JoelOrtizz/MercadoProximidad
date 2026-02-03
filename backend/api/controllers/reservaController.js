import pool from "../config/db.js";
import { fetchReservas, findById, responderCancelacion, solicitarCancelacionReserva } from "../models/reservaModel.js";

export async function getReserva(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      const error = new Error("No autenticado.");
      error.status = 401;
      throw error;
    }

    const result = await fetchReservas(userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function postReserva(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const id_comprador = req.user?.id;
    if (!id_comprador) return res.status(401).json({ error: "No autenticado." });

    const id_producto = Number.parseInt(String(req.body?.id_producto), 10);
    const id_punto_entrega = Number.parseInt(String(req.body?.id_punto_entrega), 10);
    const cantidad = Number.parseInt(String(req.body?.cantidad), 10);

    if (!Number.isFinite(id_producto) || !Number.isFinite(id_punto_entrega) || !Number.isFinite(cantidad)) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }
    if (cantidad <= 0) return res.status(400).json({ error: "La cantidad debe ser mayor que 0." });

    await conn.beginTransaction();

    const [prodRows] = await conn.query(
      "SELECT id, id_vendedor, stock FROM productos WHERE id = ? FOR UPDATE",
      [id_producto]
    );
    const producto = Array.isArray(prodRows) ? prodRows[0] : null;
    if (!producto) {
      await conn.rollback();
      return res.status(404).json({ error: "El producto no existe." });
    }

    if (String(producto.id_vendedor) === String(id_comprador)) {
      await conn.rollback();
      return res.status(403).json({ error: "No puedes reservar tus propios productos." });
    }

    const stock = Number(producto.stock);
    if (!Number.isFinite(stock) || stock < cantidad) {
      await conn.rollback();
      return res.status(400).json({ error: `Stock insuficiente. Solo quedan ${stock}.` });
    }

    const [puntoRows] = await conn.query("SELECT id, id_vendedor FROM puntos_entrega WHERE id = ?", [
      id_punto_entrega,
    ]);
    const punto = Array.isArray(puntoRows) ? puntoRows[0] : null;
    if (!punto || String(punto.id_vendedor) !== String(producto.id_vendedor)) {
      await conn.rollback();
      return res.status(400).json({ error: "El punto de entrega no es valido para este vendedor." });
    }

    const [upd] = await conn.query("UPDATE productos SET stock = stock - ? WHERE id = ?", [
      cantidad,
      id_producto,
    ]);
    if (!upd?.affectedRows) {
      await conn.rollback();
      return res.status(400).json({ error: "No se pudo actualizar el stock." });
    }

    const [ins] = await conn.query(
      `INSERT INTO reservas (id_vendedor, id_comprador, id_producto, cantidad, id_punto_entrega)
       VALUES (?,?,?,?,?)`,
      [producto.id_vendedor, id_comprador, id_producto, cantidad, id_punto_entrega]
    );

    await conn.commit();

    res.status(201).json({
      success: true,
      message: "Reserva solicitada con exito.",
      reservaId: ins?.insertId,
    });
  } catch (err) {
    try {
      await conn.rollback();
    } catch {}
    next(err);
  } finally {
    try {
      conn.release();
    } catch {}
  }
}

export async function getReservaById(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      const error = new Error("No autenticado.");
      error.status = 401;
      throw error;
    }

    const id = Number.parseInt(req.params?.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Reserva no encontrada" });

    const reserva = await findById(id);
    if (!reserva) return res.status(404).json({ error: "Reserva no encontrada" });

    if (String(reserva.id_vendedor) !== String(userId) && String(reserva.id_comprador) !== String(userId)) {
      return res.status(403).json({ error: "No autorizado" });
    }

    res.status(200).json(reserva);
  } catch (err) {
    next(err);
  }
}

export async function cancelReservation(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "No autenticado." });

    const id = Number.parseInt(String(req.params?.id), 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Reserva no encontrada" });

    await conn.beginTransaction();

    const [resRows] = await conn.query(
      "SELECT id, id_producto, id_comprador, estado, cantidad FROM reservas WHERE id = ? FOR UPDATE",
      [id]
    );
    const reserva = Array.isArray(resRows) ? resRows[0] : null;
    if (!reserva) {
      await conn.rollback();
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    if (String(reserva.id_comprador) !== String(userId)) {
      await conn.rollback();
      return res.status(403).json({ error: "No autorizado" });
    }

    if (reserva.estado !== "pendiente") {
      await conn.rollback();
      return res.status(400).json({ error: "Solo se puede cancelar una reserva pendiente" });
    }

    // Al cancelar, dejamos el punto de entrega en NULL para que el vendedor pueda cambiar sus puntos
    // sin que las reservas antiguas bloqueen el borrado por la foreign key.
    const [updReserva] = await conn.query(
      "UPDATE reservas SET estado = ?, id_punto_entrega = NULL WHERE id = ?",
      ["cancelada", id]
    );
    if (!updReserva?.affectedRows) {
      await conn.rollback();
      return res.status(400).json({ error: "No se pudo cancelar la reserva." });
    }

    const cantidad = Number.parseInt(String(reserva.cantidad), 10);
    const id_producto = Number.parseInt(String(reserva.id_producto), 10);
    if (Number.isFinite(cantidad) && Number.isFinite(id_producto) && cantidad > 0) {
      await conn.query("UPDATE productos SET stock = stock + ? WHERE id = ?", [cantidad, id_producto]);
    }

    await conn.commit();

    return res.json({
      mensaje: "Reserva cancelada correctamente",
      id_reserva: id,
      nuevo_estado: "cancelada",
    });
  } catch (err) {
    try {
      await conn.rollback();
    } catch {}
    next(err);
  } finally {
    try {
      conn.release();
    } catch {}
  }
}

export async function updateEstado(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const id = Number.parseInt(String(req.params?.id), 10);
    const estado = String(req.body?.estado || "");

    const estadosValidos = ["aceptada", "rechazada", "completada"];
    if (!Number.isFinite(id)) return res.status(400).json({ error: "Reserva no encontrada" });
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({ error: "Estado no valido" });
    }

    await conn.beginTransaction();

    const [rows] = await conn.query(
      "SELECT id, id_vendedor, id_producto, cantidad, estado FROM reservas WHERE id = ? FOR UPDATE",
      [id]
    );
    const reserva = Array.isArray(rows) ? rows[0] : null;
    if (!reserva) {
      await conn.rollback();
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    if (String(reserva.id_vendedor) !== String(req.user?.id)) {
      await conn.rollback();
      return res.status(403).json({ error: "No autorizado" });
    }

    const estadoPrevio = String(reserva.estado || "");

    // Si la reserva pasa a "rechazada" o "completada", ya no queremos que bloquee cambios de puntos de entrega.
    // Por eso ponemos el punto en NULL en esos casos.
    let sqlUpdate = "UPDATE reservas SET estado = ? WHERE id = ?";
    let paramsUpdate = [estado, id];
    if (estado === "rechazada" || estado === "completada") {
      sqlUpdate = "UPDATE reservas SET estado = ?, id_punto_entrega = NULL WHERE id = ?";
      paramsUpdate = [estado, id];
    }

    const [upd] = await conn.query(sqlUpdate, paramsUpdate);
    if (!upd?.affectedRows) {
      await conn.rollback();
      return res.status(400).json({ error: "No se pudo actualizar" });
    }

    if (
      estado === "rechazada" &&
      (estadoPrevio === "pendiente" || estadoPrevio === "aceptada")
    ) {
      const cantidad = Number.parseInt(String(reserva.cantidad), 10);
      const id_producto = Number.parseInt(String(reserva.id_producto), 10);
      if (Number.isFinite(cantidad) && Number.isFinite(id_producto) && cantidad > 0) {
        await conn.query("UPDATE productos SET stock = stock + ? WHERE id = ?", [cantidad, id_producto]);
      }
    }

    await conn.commit();

    return res.json({
      mensaje: `Estado actualizado a ${estado}`,
      id_reserva: id,
      nuevo_estado: estado,
    });
  } catch (err) {
    try {
      await conn.rollback();
    } catch {}
    next(err);
  } finally {
    try {
      conn.release();
    } catch {}
  }
}

// CANCELACIONES
export async function solicitarCancelacion(req, res, next) {
   
  try {

    const userId = req.user?.id;
    const id = Number.parseInt(req.params?.id, 10);

    if(!userId) {
      return res.status(401).json({error: "No autenticado."});
    }

    await solicitarCancelacionReserva(id, userId);

    res.json({message: "Solicitud de cancelaión enviada."});

  }catch (err) {

    next(err);

  }
}

export async function procesarRespuestaCancelacion(req, res, next) {
  try {
    const userId = req.user?.id;
    const id = Number.parseInt(req.params?.id, 10);
    const {decision} = req.body; //aceptar o rechazar

    if (!userId){
      return res.status(401).json({error: "No autenticado"});
    }

    if (!decision) {
      return res.status(400).json({error: "falta la decisión"});
    }

    const result = await responderCancelacion(id, userId, decision);

    res.json(result);

  }catch (err) {
    next(err);
  }
}
