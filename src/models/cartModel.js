import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
    user: { type: String  },
    products: [
        {
        productId:{type: mongoose.Schema.Types.ObjectId, ref: "products"},
        title: { type: String },
        thumbnail: { type: String },
        price: { type: Number },
        quantity: { type: Number }
        }
    ],
    totalPrice: { type: Number }
})

const Cart = mongoose.model('carts', cartSchema)

export { Cart }