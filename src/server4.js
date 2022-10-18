import path from 'path';
import express from 'express'
import routes from './router/index.js'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';

//passport
import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import mongoose from 'mongoose';
import { hashPassword, isValidPassword } from './utils/hashPasswords.js'

import { Server } from 'socket.io'
import { chatDAO } from './DAO/chatDAO.js';
import { userDAO } from './DAO/userDAO.js';
import { dirname } from 'path';
import { mongodbURL } from './database/config.js';
import { fileURLToPath } from 'url';
import { normalizedMessages } from './utils/normalize.js';


import cluster from 'cluster';
import os from 'os';

const cpus = os.cpus()

//env
import dotenv from 'dotenv'
dotenv.config()

//yarg:
import yargs from 'yargs';
const yargsOptions = yargs(process.argv.slice(2))

const args = yargsOptions.alias({
  p: "port",
  m: "mode"
}).default({
  port: 8080,
  mode: "fork"
}).argv

console.log("Puerto:",args.p)
console.log("Modo del servidor:", args.m)




const app = express() 
const PORT = args.port

const isCluster= args.m == 'cluster'




if(isCluster && cluster.isPrimary) {
  cpus.map(() => {
    cluster.fork()
  })
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`)
    cluster.fork()
  })
} else {


  //para acceder al body
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  //console.log(process.env.DB_CONNECTION)
  //await mongoose.connect(mongodbURL.connectionString)
  await mongoose.connect(process.env.DB_CONNECTION)
  console.log("Conectado a la base Mongo")



  //server
  const expressServer = app.listen(PORT, () => {
    console.log('Server escuchando en el puerto 8080')
  })


  const io = new Server(expressServer)

  //Session configuration
  const mongoOptions = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  };
  
  app.use(cookieParser());
  app.use(
    session({
      store: MongoStore.create({
        mongoUrl:process.env.DB_CONNECTION,
        mongoOptions,
      }),
      secret: "coderhouse",
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        httpOnly : false,
        secure : false,
        maxAge: 10000,
      },
    })
  );
  
  //passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  const loginStrategy = new LocalStrategy(
    async (username, password, done) => {
    try {
      //console.log("Entro al LoginStrategy");
      const dbuser = await userDAO.getByUsername(username)
      
      if (!dbuser || !isValidPassword(password, dbuser.password)) {
        return done(null, null);
      }
      //console.log("Usuario Logueado:", dbuser);
      
      done(null, dbuser);
  
    } catch (err) {
      console.log("Error al loguear el usuario", err);
      done("Error al loguear el usuario", null);
    }
  });
  
  const registerStrategy = new LocalStrategy(
    { passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        //verifico si el usuario ya existe
        const existingUser = await userDAO.getByEmail(email)
  
        if (existingUser) {
          return done(null, null);
        }
  
        const newUser = {
          email:req.body.email,
          password: hashPassword(password),
          username: req.body.username,
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        };
  
        const createdUser = await userDAO.createDocument(newUser);
  
        done(null, createdUser);
      } catch (err) {
        console.log("Error al registrar el usuario", err);
        done("Error al registrar el usuario", null);
      }
    }
  );
  
  
  passport.use("login", loginStrategy);
  passport.use("register", registerStrategy);
  
  
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser((id, done) => {
    userDAO.getById(id, done);
  });
  
  
  
  //EJS
  const __dirname = dirname(fileURLToPath(import.meta.url))
  app.use(express.static(path.join(__dirname,'./views')));
  
  app.set('views', path.join(__dirname, './views'))
  app.set('view engine', 'ejs')
  
  
  //SERVER.IO
  io.on('connection', async socket =>  {
      console.log(`Se conecto el cliente con id: ${socket.id}`)
  
      //obtengo los mensajes
      const messagesFromDB = await chatDAO.getAll()
      const normalizedChat = normalizedMessages(messagesFromDB)
  
      //Envio mensajes normalizados al front
      socket.emit('server:renderMessages', normalizedChat)
      
      //Evento de nuevo mensaje
      socket.on('client:newMessage', async (messageInfo) => {
          await chatDAO.postMessage(messageInfo)
  
          //por cada mensaje que se envía, actualizo a todos los clientes
          const messagesFromDB = await chatDAO.getAll()
          const normalizedChat = normalizedMessages(messagesFromDB)
          io.emit('server:renderMessages', normalizedChat)
      })
  })
  
  //Routes
  app.use('/api2', routes)







}

export { args } 