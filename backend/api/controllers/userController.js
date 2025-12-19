import bcrypt from 'bcrypt'

import { insertUser } from '../models/userModel.js'

// ==============================
// POST USERS
// ==============================

export const register = async (req, res) => {
    try {

        const { nombre, nickname, email, contrasena } = req.body;

        // Encriptación de la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Guardar en la BD
        const id = await insertUser({
            nombre,
            nickname,
            email,
            contrasena: hashedPassword
        });

        res.status(201).json({
            id,
            message: "Usuario insertado con éxito."
        });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }
}