const { Producto, Categoria } = require("../models");

const getProducts = async (req, res) => {
  const { limite = 5, desde = 0 } = req.query;
  const totalPromise = Producto.countDocuments({ estado: true });
  const productsPromise = Producto.find({ estado: true })
    .populate("usuario", "nombre")
    .populate("categoria", "nombre")
    .skip(Number(desde))
    .limit(Number(limite));
  try {
    const [total, products] = await Promise.all([
      totalPromise,
      productsPromise,
    ]);
    res.status(200).json({ total, products });
  } catch (error) {
    res.status(401).json(error);
  }
};
const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const getProduct = await Producto.findById(id)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre");
    res.status(200).json(getProduct);
  } catch (error) {
    return res.status(401).json(error);
  }
};
const createProduct = async (req, res) => {
  const categoria = req.body.categoria.toUpperCase();
  const { nombre, precio, desc, disponible } = req.body;
  try {
    const category = await Categoria.findOne({ nombre: categoria });
    if (!category) {
      return res.status(401).json({ msg: "Esa categoria no existe" });
    }
    const data = {
      nombre,
      precio,
      desc,
      disponible,
      usuario: req.usuario._id,
      categoria: category._id,
    };
    const newProduct = new Producto(data);
    await newProduct.save();
    res.status(200).json(newProduct);
  } catch (error) {
    return res.status(401).json(error);
  }
};
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  data.categoria = data.categoria.toUpperCase();
  data.usuario = req.usuario._id;
  try {
    const category = await Categoria.findOne({ nombre: data.categoria });
    if (!category) {
      return res.status(401).json({ msg: "Esa categoria no existe" });
    }
    const updateProduct = await Producto.findByIdAndUpdate(
      id,
      {
        ...data,
        categoria: category._id,
      },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (error) {
    return res.status(401).json(error);
  }
};
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const productDelete = await Producto.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );
    res.status(200).json(productDelete);
  } catch (error) {
    return res.status(401).json(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
