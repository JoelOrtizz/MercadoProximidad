import { getCategorias } from "../models/categoriasModel.js";

export async function fetchCategorias(req, res, next) {
  try {
    const result = await getCategorias();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}