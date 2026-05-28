import { getLogs } from '../models/logsModel.js';

export const fetchLogs = async (req, res, next) => {
  try {
    const { start_date, end_date, user_id } = req.query || {};

    const logs = await getLogs({
      startDate: start_date || null,
      endDate: end_date || null,
      userId: user_id ? Number(user_id) : null,
    });

    return res.status(200).json({ logs });

  } catch (error) {
    return next(error);
  }
};




