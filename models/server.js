const express = require('express');
const cors = require('cors');
const { dbConection } = require('../db/config');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersRoutes = '/api/users';
        this.authPath = '/api/auth';

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
        this.app.use(express.static('public'))

        this.app.use(express.urlencoded({extended:true}));

    }

    routes() {
        this.app.use(this.authPath,require('../routes/auth'));
        this.app.use(this.usersRoutes,require('../routes/user'));
    }

    listen() {
        this.app.listen(this.port, ()=> {
            console.log('Servidor corriendo en el puerto', this.port);
        });
    }
}

module.exports = Server;





