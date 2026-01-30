import pool from '../config/db.js';

const notFound = (message) => {
  const error = new Error(message);
  error.status = 404;
  return error;
};

const forbidden = (message) => {
  const error = new Error(message);
  error.status = 403;
  return error;
};

export async function listChatsForUser(userId) {
  const uid = Number(userId);

  const [rows] = await pool.query(
    `
    SELECT
      c.id,
      CASE WHEN c.id_usuario_1 = ? THEN c.id_usuario_2 ELSE c.id_usuario_1 END AS other_user_id,
      u.nickname AS other_nickname,
      u.nombre AS other_nombre,
      m.mensaje AS last_message,
      m.fecha_creacion AS last_message_at
    FROM chats c
    JOIN usuarios u
      ON u.id = CASE WHEN c.id_usuario_1 = ? THEN c.id_usuario_2 ELSE c.id_usuario_1 END
    LEFT JOIN mensajes m
      ON m.id = (
        SELECT m2.id
        FROM mensajes m2
        WHERE m2.id_chat = c.id
        ORDER BY m2.fecha_creacion DESC, m2.id DESC
        LIMIT 1
      )
    WHERE c.id_usuario_1 = ? OR c.id_usuario_2 = ?
    ORDER BY COALESCE(m.fecha_creacion, c.created_at) DESC, c.id DESC
    `,
    [uid, uid, uid, uid]
  );

  return rows;
}

export async function assertUserInChat(chatId, userId) {
  const cid = Number(chatId);
  const uid = Number(userId);

  const [rows] = await pool.query('SELECT id_usuario_1, id_usuario_2 FROM chats WHERE id = ?', [cid]);
  const chat = rows && rows[0] ? rows[0] : null;
  if (!chat) throw notFound('Chat no encontrado');

  const ok = String(chat.id_usuario_1) === String(uid) || String(chat.id_usuario_2) === String(uid);
  if (!ok) throw forbidden('No autorizado para este chat');
}

export async function listMensajes(chatId) {
  const cid = Number(chatId);
  const [rows] = await pool.query(
    `
    SELECT id, id_chat, id_usuario, mensaje, id_reserva, fecha_creacion
    FROM mensajes
    WHERE id_chat = ?
    ORDER BY fecha_creacion ASC, id ASC
    `,
    [cid]
  );
  return rows;
}

export async function insertMensaje(chatId, userId, mensaje) {
  const cid = Number(chatId);
  const uid = Number(userId);

  const text = String(mensaje || '').trim();
  if (!text) {
    const error = new Error('Mensaje vacio');
    error.status = 400;
    throw error;
  }

  const [result] = await pool.query(
    'INSERT INTO mensajes (id_chat, id_usuario, mensaje, id_reserva) VALUES (?, ?, ?, NULL)',
    [cid, uid, text]
  );

  const insertedId = result && result.insertId ? result.insertId : null;
  const [rows] = await pool.query(
    'SELECT id, id_chat, id_usuario, mensaje, id_reserva, fecha_creacion FROM mensajes WHERE id = ?',
    [insertedId]
  );
  return rows && rows[0] ? rows[0] : null;
}

export async function findOrCreateChat(userAId, userBId) {
  const a = Number(userAId);
  const b = Number(userBId);

  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    const error = new Error('Usuarios invalidos');
    error.status = 400;
    throw error;
  }

  if (String(a) === String(b)) {
    const error = new Error('No se puede crear chat con uno mismo');
    error.status = 400;
    throw error;
  }

  const minId = a < b ? a : b;
  const maxId = a < b ? b : a;

  const [existing] = await pool.query('SELECT id FROM chats WHERE id_usuario_min = ? AND id_usuario_max = ? LIMIT 1', [
    minId,
    maxId,
  ]);

  if (existing && existing[0] && existing[0].id) {
    return { id: existing[0].id, created: false };
  }

  // Si dos peticiones llegan a la vez, el UNIQUE evitará duplicados.
  // Si hay duplicado, simplemente volvemos a buscar el id.
  try {
    await pool.query(
      'INSERT INTO chats (id_usuario_1, id_usuario_2, id_usuario_min, id_usuario_max) VALUES (?, ?, ?, ?)',
      [a, b, minId, maxId]
    );
  } catch (err) {
    if (err && err.code !== 'ER_DUP_ENTRY') throw err;
  }

  const [after] = await pool.query('SELECT id FROM chats WHERE id_usuario_min = ? AND id_usuario_max = ? LIMIT 1', [
    minId,
    maxId,
  ]);

  if (after && after[0] && after[0].id) {
    return { id: after[0].id, created: true };
  }

  const error = new Error('No se pudo crear el chat');
  error.status = 500;
  throw error;
}
