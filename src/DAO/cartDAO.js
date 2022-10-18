import { Cart } from "../models/cartModel.js"

const cartDAO = {

    async getById(id) {
        console.log("Busco el cart con id: ", id)
        const doc = await Cart.find({ _id: id }, {products: 1, user: 1, _id:0})
        return doc[0]
    },

    async getByUserId(userId){
        const doc = await Cart.findOne({ user: userId }, {products: 1, user: 1, _id:1})
        return doc
    },

    async getAll(){
        const doc = await Cart.find({})
        return doc
    },

    async createDocument(document){
        const doc = await Cart.insertMany(document)
        return doc[0]._id
    },

    async updateDocument(id, paramsToUpdate){
        console.log("id:")
        console.log(id)
        console.log("paramsToUpdate:")
        console.log(paramsToUpdate)
        const doc = await Cart.updateOne({ _id: id }, {$set: paramsToUpdate})
        //return "Documento actualizado en la base :)"
        return doc
    },

    async deleteById(id){
        const doc = await Cart.deleteOne({ _id: id })
        return "Documento eliminado de la base :)"
    },

    async deleteProductInCart(cartId, productId){
        const cart = await Cart.find({ _id: cartId })
        const productsInCar = cart[0].products
        const newCartProducts = productsInCar.filter( product => product.productId != productId )

        const doc = await Cart.updateOne({ _id: cartId }, { $set: { products : newCartProducts }} )
 
        return `Producto eliminado del carrito :)`
    }

}

export { cartDAO }