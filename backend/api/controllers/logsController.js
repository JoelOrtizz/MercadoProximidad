import { getLogs } from '../models/logsModel.js';

export const fetchLogs = async (req, res, next) => {
  try {
    const { start_date, end_date, user_id, action, limit } = req.query || {};

    const logs = await getLogs({
      startDate: start_date || null,
      endDate: end_date || null,
      userId: user_id ? Number(user_id) : null,
      action: action || null,
      limit: limit ? Number(limit) : 200,
    });

    return res.status(200).json({ logs });
  } catch (error) {
    return next(error);
  }
};




