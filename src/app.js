import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import {engine} from 'express-handlebars';
import {Server} from 'socket.io'

import { router as vistasRouter } from './routes/vistasRouter.js';

const PORT=3000;

const app=express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'/public')));

app.use('/', vistasRouter)


const server=app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

const io=new Server(server)

let usuarios=[]
let mensajes=[]

io.on("connection", socket=>{
    console.log(`Se conecto el cliente ${socket.id}`)
    socket.emit("identifiquese",mensajes)

    socket.on("id",nombre=>{
        console.log(nombre)
        console.log(`El cliente ${socket.id} se llama ${nombre}`)
        usuarios.push({usuario:nombre, id:socket.id})
        socket.broadcast.emit("usuarioConectado",nombre)

    })

    socket.on('disconnect',()=>{
        let desconectado=usuarios.find(u=>u.id===socket.id)
        if(desconectado){
            console.log(`Se ha desconectado el usuario ${desconectado.usuario}`)
            socket.broadcast.emit("usuarioDesconectado",desconectado.usuario)
        }
    })


    socket.on("mensaje",datos=>{
        mensajes.push(datos)
        io.emit("nuevoMensaje",datos)
    })


})
