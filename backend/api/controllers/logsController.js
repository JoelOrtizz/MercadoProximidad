import { getLogs, getLogsUserId } from "../models/logsModel.js";

export async function getLog(req, res, next) {
    try{
        const result = await getLogs();
        res.status(200).json(result);
        
    }catch(err){
        next(err);
    }
}

export async function getLogId(req, res, next) {
    try {
        const user_id = req.params;
        const result = await getLogs(user_id);
        res.status(200).json(result);

    } catch (err) {
        next(err);
    }
}