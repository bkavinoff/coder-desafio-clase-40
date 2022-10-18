import { Product } from "../models/productsModel.js"
import CustomError from "../classes/customError.class.js"
import MongoClient from "../classes/MongoClient.class.js"
import productDTO from "../DTO/productDTO.js"
import ProductRepository from "../repository/productRepository.js"
//import MongoClient from "../classes/mongoClient.class.js"
// const productDAO = {

//     async getById(id) {
//         const doc = await Product.find( { _id: id } )
//         return doc
//     },

//     async getAll(){
//         const doc = await Product.find({})
//         return doc
//     },

//     async createDocument(document){
//         const doc = await Product.insertMany(document)
//         return doc[0]._id
//     },

//     async updateDocument(id, paramsToUpdate){
//         const doc = await Product.updateOne({ _id: id }, {$set: paramsToUpdate})
//         return "Documento actualizado en la base :)"
//     },

//     async deleteById(id){
//         const doc = await Product.deleteOne({ _id: id })
//         return "Documento eliminado de la base :)"
//     }

// }

let instance;

class productDAO {
    constructor(){
        this.db = new MongoClient()
        this.collection = Product
        this.productRepository = new ProductRepository(Product)
    }
    static getInstance() {
        if (!instance) {
          instance = new productDAO();
        }
    
        return instance;
    }

    async getAll(){
        try{
            await this.db.connect()
            const productsList = await this.productRepository.getAll()
            let products = []

            productsList.map((product) => {
                let prod = new productDTO(product)
                products.push(prod)
            })

            return products
        }catch(err){
            console.log(err)
            throw new CustomError(500, "Error getting all products from DB")
        }finally{
            //this.db.disconnect()
        }
    }

    async createDocument(newProduct){
        try{
            await this.db.connect()
            const createdProduct = await this.db.create(newProduct)
            return createdProduct._id
        }catch(err){
            console.log(err)
            throw new CustomError(500, "Error getting all products from DB")
        }finally{
            //this.db.disconnect()
        }
    }

    async updateDocument(id, paramsToUpdate){
        try{
            await this.db.connect()

            const updatedProduct = await this.db.updateOne({ _id: id }, {$set: paramsToUpdate})
            return updatedProduct._id
        }catch(err){
            console.log(err)
            throw new CustomError(500, "Error getting updating product with ID: ", id)
        }finally{
            //this.db.disconnect()
        }
    }

    async deleteById(id){
        try{
            await this.db.connect()

            const updatedProduct = await this.db.deleteOne({ _id: id })
            return updatedProduct._id
        }catch(err){
            console.log(err)
            throw new CustomError(500, "Error getting deleting product with ID: ", id)
        }finally{
            //this.db.disconnect()
        }
    }
}

export default productDAO