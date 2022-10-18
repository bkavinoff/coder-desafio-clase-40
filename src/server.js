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
//import { mongodbURL } from './database/config.js';
import { fileURLToPath } from 'url';
import { normalizedMessages } from './utils/normalize.js';
import { User } from './models/userModel.js';


//DB:
import CuscomError from "./classes/customError.class.js"
import MongoClient from "./classes/MongoClient.class.js"

//cluster
import cluster from 'cluster';
import os from 'os';

const cpus = os.cpus()

//env
import dotenv from 'dotenv'
import { cartDAO } from './DAO/cartDAO.js';
dotenv.config()

//yarg:
// import yargs from 'yargs';
// const yargsOptions = yargs(process.argv.slice(2))

// const args = yargsOptions.alias({
//   p: "port",
//   m: "mode"
// }).default({
//   port: 8080,
//   mode: "fork"
// }).argv

// console.log("Puerto:",args.p)
// console.log("Modo del servidor:", args.m)

const adminRoleChecker = async (req, ers, next) => {
  const user = await User.findOne({ _id: req.body.userId})
  if(user.role === "admin"){
    return next()
  }

  res.sendStatus(401)
}





const app = express() 
//const PORT = args.port
const PORT = process.env.PORT || 8080

//const isCluster= args.m == 'cluster'




// if(isCluster && cluster.isPrimary) {
//   cpus.map(() => {
//     cluster.fork()
//   })
//   cluster.on("exit", (worker) => {
//     console.log(`Worker ${worker.process.pid} died`)
//     cluster.fork()
//   })
// } else {


  //para acceder al body
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  //para subir archivos
  app.use(express.static("upload"));

  //console.log(process.env.DB_CONNECTION)
  //await mongoose.connect(mongodbURL.connectionString)
  //await mongoose.connect(process.env.DB_CONNECTION)
  //console.log("Conectado a la base Mongo")

  //DB
  try{
    const db = new MongoClient()
    await db.connect()

  }catch(err){
    console.log("Error connecting to DB")
    throw new CustomError(500, "Error connecting with the DB")
  }

  //server
  const expressServer = app.listen(PORT, () => {
    console.log('Server escuchando en el puerto 8080')
  })

//Session configuration
  const mongoOptions = { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  };
  const io = new Server(expressServer)
  
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
  
  // Estrategia de logeo
  const loginStrategy = new LocalStrategy(
    async (username, password, done) => {
        try {
            let user = await User.findOne({ username })
            if(!user || !isValidPassword(password, user.password)){
                return done(null, null)
            }
            
            //user = new userDTO(user)

            done(null, user)
            
        } catch (error) {
            console.log("Error login", err);
            done("Error login", null);
        }
    }
  )
  
  const registerStrategy = new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
        try {
          const existingUser = await User.findOne({ username })
  
          if(existingUser){
            return done(null, null)
          }
  
          //creo un cart para ese usuario
          let newCart = {
             user:"", 
             products: [{}]
          }
          const createdCartId = await cartDAO.createDocument(newCart)

          console.log("cart creado: ", createdCartId)
          const newUser = {
              username,
              email: req.body.email,
              password: hashPassword(password),
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              address: req.body.lastName,
              userPhone: req.body.userPhone ,
              cartId: createdCartId.toString(),
              avatar: `http://localhost:${PORT}/${req.file.filename}`
          }
          const createdUser = await User.create(newUser)
          await createdUser.save()

          console.log("user creado: ", createdUser)

          newCart.user = createdUser._id.toString()
          //actualizo el cart con el id de lusuario:
          const cartResponse = await cartDAO.updateDocument(createdCartId, newCart)
          console.log("cart actualizado: ", cartResponse)

          req.body.userId = createdUser._id
          //req.body.avatar = createdUser.avatar
          req.body.userPhone = createdUser.userPhone
          
          console.log("Nuevo usuario creado: ",newUser)
          done(null, createdUser)
  
        } catch (error) {
            console.log("Error registrando usuario", error)
            done("Error en registro", null)
        }
    }
  )
  
  passport.use("login", loginStrategy);
  passport.use("register", registerStrategy);
  
  
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser((id, done) => {
    userDAO.getById(id, done);
  });
  
  
  
  //EJS
  //confiuracion para poder usar el __dirname y el path en module
  app.use(express.static("upload"))
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
  app.use('/api', routes)

//}


// export { args } 