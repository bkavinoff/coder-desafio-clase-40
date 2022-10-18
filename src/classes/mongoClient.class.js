import DBClient from "./DBClient.class.js";
import mongoose from "mongoose"
import { mongodbURL } from '../database/config.js';
import CustomError from "./customError.class.js";

class MongoClient extends DBClient {
    constructor() {
        super() //esto es para heredar los metodos de la clase padre
        this.connected = false
        this.client = mongoose


    }

    async connect(){
        try{
            await this.client.connect(mongodbURL.connectionString)
            this.connected = true
            console.log("Database Connected!!")
        }catch(err){
            console.log(err)
            throw new CustomError(500, "Error connecting with the DB")
        }
    }

    async disconnect(){
        try{
            await this.client.connection.close()
            this.connected = false
            console.log("Database Disconnected!!")
        }catch(err){
            console.log(err)
            throw new CustomError(500, "Error disconnecting with the DB")
        }
    }
     
}

export default MongoClient