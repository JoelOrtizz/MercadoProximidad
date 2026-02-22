import { crearIncidencia, incidenciaComprador, incidenciaVendedor } from "../models/incidenciasModel.js";

export async function postIncidencia(req, res, next) {
    try{
        const userId = req.user?.id;
        const { id_reserva } = req.params;
    }catch(err){
        
    }
}   