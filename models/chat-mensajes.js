
class Mensaje {
    constructor( uid, nombre, mensaje ) {
        this.uid     = uid;
        this.nombre  = nombre;
        this.mensaje = mensaje;
    }
}


class ChatMensajes {

    constructor() {
        this.mensajes = [];
        this.usuarios = {};
    }

    get ultimos10() {
        this.mensajes = this.mensajes.splice(0,10) //se obtienen los ultimos 10 mensajes;
        return this.mensajes;
    }

    get usuariosArr() {
        return Object.values( this.usuarios ); // [ {}, {}, {}] usuarios conectados toma el objeto y lo transforma en un arreglo
    }

    enviarMensaje( uid, nombre, mensaje ) { //uid de la persona que esta enviando el mensaje, el nombre y el mensaje
        this.mensajes.unshift(
            new Mensaje(uid, nombre, mensaje) //instansiamos un mensaje y lo guardamos en el arreglo de mensajes
        );
    }

    conectarUsuario( usuario ) {
        this.usuarios[usuario.id] = usuario //En el código que has mostrado, this.usuarios es un objeto utilizado para almacenar los usuarios conectados en el chat. La línea this.usuarios[usuario.id] = usuario asigna un usuario al objeto this.usuarios, utilizando el id del usuario como índice. En MongoDB, cada documento tiene un campo _id que es único para cada documento en una colección. Por lo tanto, si estás utilizando MongoDB y el objeto usuario tiene una propiedad id que corresponde al _id del documento en la base de datos, puedes utilizar ese valor como índice para almacenar el usuario en el objeto this.usuarios. Esta técnica es comúnmente utilizada cuando se desea acceder rápidamente a un usuario específico por su identificador único, en lugar de tener que iterar sobre una lista de usuarios para encontrar el usuario deseado.
        //En JavaScript, los objetos pueden utilizar tanto la notación de punto (objeto.propiedad) como la notación de corchetes (objeto['propiedad']) para acceder y asignar valores a las propiedades., En el caso de this.usuarios[usuario.id] = usuario, se está utilizando la notación de corchetes para asignar el objeto usuario al objeto this.usuarios, utilizando usuario.id como clave. Esto significa que se está creando una propiedad en this.usuarios cuya clave es el valor de usuario.id y cuyo valor es el objeto usuario.
    }

    desconectarUsuario( id ) {
        delete this.usuarios[id]; //se borra el usuario del arreglo 
    }

}

module.exports = ChatMensajes;