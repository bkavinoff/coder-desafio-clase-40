import { User } from "../models/userModel.js"

const userDAO = {

    async getById(id) {
        const doc = await User.findOne( { _id: id } )
        return doc
    },
    async getUserAvatarById(id) {
        const doc = await User.findOne( { _id: id } )
        return doc.avatar
    },

    async getByEmail(email) {
        const doc = await User.findOne( { email: email } )
        return doc
    },

    async findOne(username) {
        const doc = await User.findOne({ username })
        return doc
    },

    async getByUsername(username) {
        const doc = await User.findOne( { username } )
        return doc
    },
    async getUserIdByUsername(username) {
        const doc = await User.findOne( { username } )
        return doc._id.toString()
    },

    async getCartByUsername(username) {
        const doc = await User.findOne( { username: username } )
        return doc.cartId
    },

    // async getByUsernameAndPassword(username, password) {
    //     const doc = await User.find( { username: username, password:password } )
    //     return doc
    // },

    async getAll(){
        const doc = await User.find({})
        return doc
    },

    async createDocument(document){
        const doc = await User.insertMany(document)
        console.log("Usuario creado:")
        console.log(doc)
        return doc[0]._id
    },

    async updateDocument(id, paramsToUpdate){
        const doc = await User.updateOne({ _id: id }, {$set: paramsToUpdate})
        return "Documento actualizado en la base :)"
    },

    async deleteById(id){
        const doc = await User.deleteOne({ _id: id })
        return "Documento eliminado de la base :)"
    }

}

export { userDAO }