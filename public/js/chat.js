
const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-curso-fher.herokuapp.com/api/auth/';


  let usuario = null;
   let socket  = null;

   // Referencias HTML
const txtUid     = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir   = document.querySelector('#btnSalir');



// Validar el token del localstorage
// Validar el token del localstorage

// Validar el token del localstorage
const validarJWT = async() => {

    const token = localStorage.getItem('token') || '';

    if ( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB );
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();
    
}

const conectarSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    }); 

    socket.on('connect', () =>{
        console.log('Sockets online')
    });

    socket.on('disconnect', () =>{
        console.log('Sockets offline')
    });

    socket.on('recibir-mensajes', (payload) => {
        console.log(payload);
    });
    socket.on('recibir-mensajes', dibujarMensajes );
    socket.on('usuarios-activos', dibujarUsuarios ); //socket.on('usuarios-activos', (payload) => { ... });: Este código define un evento en el lado del cliente (front-end) que escucha el evento 'usuarios-activos' enviado por el servidor. Cuando se recibe dicho evento, se ejecuta la función de devolución de llamada proporcionada. El parámetro payload contiene los datos enviados desde el servidor.
     

    socket.on('mensaje-privado', ( payload ) => {
        console.log('Privado:', payload )
    });

    
}

const dibujarUsuarios = ( usuarios = []) => { //llega del backend los usuarios conectados

    let usersHtml = '';
    usuarios.forEach( ({ nombre, uid }) => { //se desestructura el arreglo para obtener solo el nombre y el uid
        //se le concatena al html la cadena de abajo
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ nombre } </h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml; //se muestran los usuarios en la pantalla de chat (chat.html)

}
const dibujarMensajes = ( mensajes = []) => {

    let mensajesHTML = '';
    mensajes.forEach( ({ nombre, mensaje }) => {

        mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary">${ nombre }: </span>
                    <span>${ mensaje }</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHTML;

}
txtMensaje.addEventListener('keyup', ({ keyCode }) => { //el key up es un avento que se dispara cuando el usuario presiona una tecla, ese evento se desestructura para obtener el numero de la tecla exacta que el usuario presiono
    
    const mensaje = txtMensaje.value;
    const uid     = txtUid.value;

    if( keyCode !== 13 ){ return; } //la tecla 13 es el enter, si se presiona se sale
    if( mensaje.length === 0 ){ return; } //si no se escribe nada se sale

    socket.emit('enviar-mensaje', { mensaje, uid }); //se envia el mensaje y el uid del usuario que lo escribio

    txtMensaje.value = '';

})

const main = async() => {
    // Validar JWT
    await validarJWT();
}

main();