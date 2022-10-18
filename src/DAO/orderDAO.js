import { Order } from "../models/orderModel.js"

const orderDAO = {

    async getById(id) {
        console.log("Busco el cart con id: ", id)
        const doc = await Order.find({ _id: id })
        return doc[0]
    },

    async getByUserId(userId){
        const doc = await Order.findOne({ user: userId })
        return doc
    },

    async getAll(){
        const doc = await Order.find({})
        return doc
    },

    async createDocument(document){
        const doc = await Order.insertMany(document)
        return doc[0]._id
    },

    async updateDocument(id, paramsToUpdate){
        const doc = await Order.updateOne({ _id: id }, {$set: paramsToUpdate})
        return doc
    },

    async deleteById(id){
        const doc = await Order.deleteOne({ _id: id })
        return "Documento eliminado de la base :)"
    },

}

export { orderDAO }