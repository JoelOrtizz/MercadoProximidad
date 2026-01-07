import { getUser, insertUser, deleteUserById, updateUserById } from '../models/userModel.js'


// ==============================
// POST USERS
// ==============================

export const fetchUser = async (req, res) => {
    try {

        const users = await getUser();

        if (users.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        };

        res.status(200).json({ users });


    } catch (error) {

        res.status(500).json({ message: error.message });

    }
}

export const register = async (req, res) => {
    try {

        const { nombre, nickname, email, contrasena } = req.body;

        // Guardar en la BD
        const id = await insertUser( nombre, nickname, email, contrasena );

        res.status(201).json({
            id,
            nombre: nombre,
            nickname: nickname,
            email: email,
            message: "Usuario insertado con éxito.",
        });

    } catch (error) {

        res.status(500).json({ message: error.message });

    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await deleteUserById(id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado."
            })
        }

        res.json({
            id,
            message: "Usuario eliminado correctamente."
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


export const updateUser = async (req, res) => {
    try {
        const { id } = req.params

        const { nombre, nickname, email, contrasena } = req.body;

        const result = await updateUserById(id, nombre, nickname, email, contrasena);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Usuario no encontrado."
            })
        }

        res.json({
            id,
            nombre: nombre,
            nickname: nickname,
            email: email,
            message: "Usuario actualizado correctamente."
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}