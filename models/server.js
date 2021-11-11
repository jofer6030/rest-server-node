const express = require("express");
const cors = require("cors");
const { dbConection } = require("../db/config");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      user: "/api/user",
      category: "/api/category",
      products: "/api/products",
      buscar: "/api/buscar",
      uploads: "/api/uploads",
    };

    //Conectar a la DB
    this.conectarDB();

    //Middlewares
    this.middlewares();

    //Rutas de mi aplicacion
    this.routes();
  }

  async conectarDB() {
    await dbConection();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    //Lectura y Parseo del middelware
    this.app.use(express.json());

    //Directorio publico
    this.app.use(express.static("public"));

    this.app.use(express.urlencoded({ extended: true }));

    //Carga de Archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.user, require("../routes/user"));
    this.app.use(this.paths.category, require("../routes/category"));
    this.app.use(this.paths.products, require("../routes/products"));
    this.app.use(this.paths.buscar, require("../routes/buscar"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
