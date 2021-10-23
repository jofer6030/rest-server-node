const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuarios = async (termino = "", res) => {
  const esMongoID = ObjectId.isValid(termino); // retorna true o false si es MongoID

  if (esMongoID) {
    const user = await Usuario.findById(termino);
    return res.json({
      results: user ? [user] : [],
    });
  }

  const regex = new RegExp(termino, "i"); // "i" mayuscula-minuscula

  const users = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });
  res.json({
    results: users,
  });
};

const buscarCategorias = async (termino = "", res) => {
  const esMongoID = ObjectId.isValid(termino); // retorna true o false si es MongoID

  if (esMongoID) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }
  const regex = new RegExp(termino, "i"); // "i" mayuscula-minuscula

  const categorias = await Categoria.find({ nombre: regex });
  res.json({
    results: categorias,
  });
};

const buscarProductos = async (termino = "", res) => {
  const esMongoID = ObjectId.isValid(termino); // retorna true o false si es MongoID

  if (esMongoID) {
    const category = await Categoria.findById(termino);
    if (!category) {
      const producto = await Producto.findById(termino).populate(
        "categoria",
        "nombre"
      );
      return res.json({ results: producto ? [producto] : [] });
    } else {
      const productos = await Producto.find({
        categoria: ObjectId(category._id),
      }).populate("categoria", "nombre");
      return res.json({
        results: productos,
      });
    }
  }
  const regex = new RegExp(termino, "i"); // "i" mayuscula-minuscula

  const productos = await Producto.find({ nombre: regex }).populate(
    "categoria",
    "nombre"
  );
  res.json({
    results: productos,
  });
};

const buscar = (req, res) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas} `,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "categorias":
      buscarCategorias(termino, res);
      break;
    case "productos":
      buscarProductos(termino, res);
      break;
    default:
      res.status(500).json({ msg: "Se le olvido hacer esta búsqueda" });
  }
};

module.exports = {
  buscar,
};
