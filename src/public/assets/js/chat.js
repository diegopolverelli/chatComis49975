console.log("chat.js...!!!")

let inputMensaje=document.getElementById("mensaje")
let divMensajes=document.getElementById("mensajes")


let nombre=''
Swal.fire({
    title:"Identifiquese",
    input:"text",
    text:"Ingrese su nickname",
    inputValidator: (value)=>{
        return !value && "Debe ingresar un nombre...!!!"
    },
    allowOutsideClick:false
}).then(resultado=>{
    const socket=io()

    nombre=resultado
    console.log(nombre)
    document.title=nombre.value

    socket.on("identifiquese",mensajes=>{
        console.log(mensajes)
        socket.emit("id",nombre.value)

        mensajes.forEach(mensaje=>{
            let parrafo=document.createElement('p')
            parrafo.classList.add('mensaje')
            parrafo.innerHTML=`<strong>${mensaje.emisor}</strong> dice: <i>${mensaje.mensaje}</i>`
            let br=document.createElement('br')
            divMensajes.append(parrafo, br)
            divMensajes.scrollTop=divMensajes.scrollHeight;
        })
    })

    socket.on("usuarioDesconectado", nombre=>{
        Swal.fire({
            text:`${nombre} se ha desconectado...!!!`,
            toast:true,
            position:"top-right"
        })
    })


    socket.on("usuarioConectado", nombre=>{
        Swal.fire({
            text:`${nombre} se ha conectado...!!!`,
            toast:true,
            position:"top-right"
        })
    })

    socket.on("nuevoMensaje", datos=>{
        let parrafo=document.createElement('p')
        parrafo.classList.add('mensaje')
        parrafo.innerHTML=`<strong>${datos.emisor}</strong> dice: <i>${datos.mensaje}</i>`
        let br=document.createElement('br')
        divMensajes.append(parrafo, br)
        divMensajes.scrollTop=divMensajes.scrollHeight;
    })

    inputMensaje.addEventListener("keyup",(e)=>{
        if(e.code==="Enter"){
            socket.emit("mensaje",{emisor:nombre.value, mensaje:e.target.value})
            e.target.value=''
        }
    })
}) // fin then sweetAlert identificacion

