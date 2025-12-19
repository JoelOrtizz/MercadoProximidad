import bcrypt from 'bcrypt'

import { insertUser } from '../models/userModel.js'
import { getById,getByNick,getByEmail } from '../models/userModel.js';


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


export const secretKey = "secret";


export const login = async (req,res) => {
    try {
        const {email,contrasena} = req.body

        const user = await getByEmail(email)

        if(!user){
            return res.status(404).json({message: "Usuario no encontrado"})
        }

        const isMatch = await bcrypt.compare(contrasena, user.contrasena)
        if(!isMatch){
            return res.status(401).json({message: "Contraseña incorrecta"})
        }

        const token = jwt.sign(
            {id: user.id, nickname: user.nickname},
            secretkey,
            {expiresIn: '1h'}
        )

        res.cookie('access_token',token,{
            httpOnly: true,
            sameSite:'strict',
            signed:true
        })

        res.json({message: "Login correct", user: {id: user.id, nickname:user.nickname  }})
    } catch(error){
        res.status(500).json({ message: error.message });
    }

}

export const logout = (req, res) => {
    res.clearCookie('access_token', {
        httpOnly: true,
        sameSite: 'strict',
        signed: true 
    });

    res.status(200).json({ message: "Sesión cerrada correctamente" });
};