import bcrypt from 'bcrypt'

import { getByEmail } from '../models/userModel.js';

export const secretKey = "secret";

export const login = async (req, res) => {
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
