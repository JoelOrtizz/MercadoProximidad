import { addFavoritos,removeFavoritos,listFavoritos } from "../models/favoritosModel.js";

export async function mostrarFavoritos(req,res,next){
    try{
        const id_usuario=req.user.id;

        if(!id_usuario){
            throw new Error("Usuario no valido");
        }

        const result = await listFavoritos(id_usuario);
        res.status(200).json(Array.isArray(result) ? result : []);
    } catch(error){
        next(error)
    }
}


export async function añadirFavoritos(req,res,next){
    let id_usuario;
    let id_producto;
    try{

        
        id_usuario=req.user.id;
        id_producto=req.body.id_producto;

        if(!id_usuario){
            throw new Error("Usuario no logueado")
        }

        const result=await addFavoritos(id_usuario,id_producto);

        res.status(201).json({
            message:"Añadido a favoritos",
            result,
            fav:true
        });

    }catch(err){

        if(err.code=='ER_DUP_ENTRY'){
            await removeFavoritos(id_usuario,id_producto);

            res.status(200).json({message:"Eliminado de favoritos",
                fav:false
            })
        }

        next(err);
    }
}