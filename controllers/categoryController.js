const { response } = require("express");
const { Categoria } = require("../models");

//updateCategory
//deleteCategory - estado: false

const crearCategory = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res
      .status(400)
      .json({ msg: `La categoria ${categoriaDB.nombre}, ya existe` });
  }

  //Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const category = new Categoria(data);

  //Guardar DB
  await category.save();

  res.status(201).json(category);
};

const getCategories = async (req, res = response) => {
  const { limite = 5, desde = 0 } = req.query;

  const totalPromise = Categoria.countDocuments({ estado: true });
  const categoriesPromise = Categoria.find({ estado: true })
    .populate("usuario", "nombre")
    .skip(Number(desde))
    .limit(Number(limite));

  try {
    const [total, categories] = await Promise.all([
      totalPromise,
      categoriesPromise,
    ]);

    res.status(201).json({ total, categories });
  } catch (error) {
    res.status(401).json(error);
  }
};

const getCategory = async (req, res = response) => {
  const { id } = req.params;

  try {
    const category = await Categoria.findById(id).populate("usuario", "nombre");
    if (!category)
      return res.status(401).json({ msg: "El id de la categoria no existe" });
    if (!category.estado)
      return res.status(401).json({ msg: "El estado es false" });

    res.status(201).json(category);
  } catch (error) {
    res.status(401).json(error);
  }
};
const updateCategory = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;
  try {
    const category = await Categoria.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(401).json(error);
  }
};
const deleteCategory = async (req, res = response) => {
  const { id } = req.params;
  try {
    const categoryDelete = await Categoria.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );
    res.status(200).json(categoryDelete);
  } catch (error) {
    res.status(401).json(error);
  }
};

module.exports = {
  crearCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
