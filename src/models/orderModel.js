import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    username:{type: String},
    name: {type: String},
    lastname: {type: String},
    email: {type: String},
    address: {type: String},
    phoneNumber: {type: String},
    products: [
        {
        productId:{type: mongoose.Schema.Types.ObjectId, ref: "products"},
        quantity: { type: Number }
        }
    ],
    totalPrice: { type: Number },
    cartId: {type: String}
})

const Order = mongoose.model('orders', orderSchema)

export { Order }