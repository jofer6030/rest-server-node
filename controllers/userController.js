const {response} = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');


const userGet = async (req, res = response) => {

    const {limite = 5, desde = 0} = req.query
    const usuariosPromise = Usuario.find({estado:true}).skip(Number(desde)).limit(Number(limite));
    const totalPromise = Usuario.countDocuments({estado:true});

    const [total,usuarios] = await Promise.all([totalPromise,usuariosPromise]);

    res.json({
        total,
        usuarios
    });
}

const userPost = async(req, res) => {
    

    const {nombre, correo, password, rol}= req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    //encriptar la contraseña
    const salt = bcrypt.genSaltSync(); //por defecto esta en (10)
    usuario.password = bcrypt.hashSync(password,salt);

    //guardar en DB

    await usuario.save();

    res.json({     
        usuario
    });
}

const userDelete = async(req, res) => {
    const {id} = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id,{estado:false},{new:true});

    res.json({
        usuario,
    });
}

const userPut = async(req, res) => {

    const {id} = req.params;
    const { _id,password, google,correo, ...resto } = req.body;

    //ToDO validar contra BD
    if(password) {
        const salt = bcrypt.genSaltSync(); //por defecto esta en (10)
        resto.password = bcrypt.hashSync(password,salt);
    }
    
    const usuario = await Usuario.findByIdAndUpdate(id, resto,{new: true});//se actualizara solo el resto del req 


    res.json({
        usuario
    });
}

module.exports = {
    userGet,
    userPost,
    userDelete,
    userPut,
}