import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: {type: String},
    lastName: {type: String},
    address: {type: String},
    userPhone: {type: String},
    cartId: {type: String},
    isAdmin: {
        type: Boolean,
        default: false
    },
    avatar: {type: String},
})

const User = mongoose.model('users', userSchema)

export { User }