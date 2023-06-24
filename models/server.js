const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');
const { socketController } = require('../sockets/controller')
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.server = createServer( this.app );
        this.io = require('socket.io')(this.server)

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
            uploads:    '/api/uploads',
        }


        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        //Sockets
        this.sockets(); //Esto es para escuchar eventos de los sockets
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        // Fileupload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.buscar, require('../routes/buscar'));
        this.app.use( this.paths.categorias, require('../routes/categorias'));
        this.app.use( this.paths.productos, require('../routes/productos'));
        this.app.use( this.paths.usuarios, require('../routes/usuarios'));
        this.app.use( this.paths.uploads, require('../routes/uploads'));
        
    }

    sockets() {
        this.io.on('connection', ( socket ) => socketController(socket, this.io ) ) //En este código, this.io es una instancia de Socket.IO que representa el servidor de sockets. La función on() de Socket.IO se utiliza para escuchar eventos en el servidor de sockets y realizar alguna acción cuando ocurren. En este caso, se está utilizando on() para escuchar el evento 'connection', que se dispara cuando un cliente se conecta al servidor de sockets. Cuando ocurre este evento, se invoca la función socketController, que asume el control de la lógica y las acciones relacionadas con ese socket específico.
    }

    listen() {
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
