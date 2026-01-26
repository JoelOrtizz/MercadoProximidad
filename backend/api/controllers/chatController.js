import { insertMensaje, listChatsForUser, listMensajes, assertUserInChat, findOrCreateChat } from '../models/chatModel.js';

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
    await assertUserInChat(chatId, userId);

    const mensaje = req.body?.mensaje;
    const row = await insertMensaje(chatId, userId, mensaje);
    return res.status(201).json(row);
  } catch (err) {
    return next(err);
  }
}

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
