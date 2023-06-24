const { Socket } = require('socket.io');
const { comprobarJWT } = require('../helpers');
const ChatMensajes = require('../models/chat-mensajes'); //OJO AQUI NO VA {ChatMensajes} con parentesis de llave porque aqui no llega un objeto que desestructurar, necesitamos el valor completo exportado por el archivo '../models/chat-mensajes', que en este caso sería la clase ChatMensajes directamente

const chatMensajes = new ChatMensajes();


const socketController = async( socket = new Socket(), io ) => {
  
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    console.log(usuario);
    if ( !usuario ) {
        return socket.disconnect();
    }
    console.log('Se conecto', usuario.nombre ); //La usuaria makoto inicio sesion y se conecto
    // Agregar el usuario conectado
    chatMensajes.conectarUsuario( usuario ); //se agrega el usuarip que se acaba de conecta en el arreglo en el que se almacena con la funcion conectarUsuario
    io.emit('usuarios-activos',  chatMensajes.usuariosArr );
    socket.emit('recibir-mensajes', chatMensajes.ultimos10 );

    // Conectarlo a una sala especial
    socket.join( usuario.id ); // global, socket.id, usuario.id

    // Limpiar cuando alguien se desconeta
    socket.on('disconnect', () => { //socket.on escucha cuando alguien se desconecta y llama al evento disconnect en chat.js
        chatMensajes.desconectarUsuario( usuario.id ); //desconectar usuario elimina al usuario del objeo de usuarios
        io.emit('usuarios-activos', chatMensajes.usuariosArr ); //se emite el evento usuarios-activos con el arreglo con el usuario ya borrado
    })

    socket.on('enviar-mensaje', ({ uid, mensaje }) => {    //se recibe el mensaje y el uid del ususario que lo envio
                
        if ( uid ) {
            // Mensaje privado
            socket.to( uid ).emit( 'mensaje-privado', { de: usuario.nombre, mensaje }); //Se manda el mensaje privado a la persona
        } else { 
        
        chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje );//en la funcion invocada enviarMensaje se manda usuario.id, usuario.nombre, mensaje para ser guardados en un arreglo de mensajes 
            io.emit('recibir-mensajes', chatMensajes.ultimos10 ); //la funcion los ultimos10 toma ese arreglo y lo corta para que solo esten los ultimos19 mensajes
        }
    })
}
module.exports = {
    socketController
}