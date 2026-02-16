import { insertMensaje, listChatsForUser, listMensajes, assertUserInChat, findOrCreateChat } from '../models/chatModel.js';
import pool from '../config/db.js';
import { createNotificacion } from '../models/notificacionModel.js';

export async function getChats(req, res, next) {
  try {
    const userId = req.user?.id;
    const rows = await listChatsForUser(userId);
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
}

export async function getMensajes(req, res, next) {
  try {
    const userId = req.user?.id;
    const chatId = req.params?.id;
    await assertUserInChat(chatId, userId);
    const rows = await listMensajes(chatId);
    return res.json(rows);
  } catch (err) {
    return next(err);
  }
}

export async function postMensaje(req, res, next) {
  try {
    const userId = req.user?.id;
    const chatId = req.params?.id;
    await assertUserInChat(chatId, userId); // verificacion

    const mensaje = req.body?.mensaje;
    const row = await insertMensaje(chatId, userId, mensaje);

    try {
      // sacamos al otro usuario para notificarle
      const [rows] = await pool.query("SELECT id_usuario_1, id_usuario_2 FROM chats WHERE id = ? LIMIT 1", [chatId]);
      const chat = rows && rows[0] ? rows[0] : null;
      if (chat) {
        const otherUserId =
          String(chat.id_usuario_1) === String(userId) ? chat.id_usuario_2 : chat.id_usuario_1;

        // notificacion creada
        if (otherUserId) {
          await createNotificacion(
            otherUserId,
            "mensaje_nuevo",
            "Nuevo mensaje",
            "Tienes un nuevo mensaje.",
            `/mensajes/${chatId}`,
            null
          );
        }
      }
    } catch (e) {
      console.error("No se pudo crear la notificacion de mensaje nuevo:", e);
    }
    

    return res.status(201).json(row);
  } catch (err) {
    return next(err);
  }
}

// iniciar conversacion
export async function postFindOrCreateChat(req, res, next) {
  try {
    const userId = req.user?.id;
    const otherUserId = req.body?.other_user_id;
    const result = await findOrCreateChat(userId, otherUserId);
    return res.status(result.created ? 201 : 200).json(result);
  } catch (err) {
    return next(err);
  }
}
