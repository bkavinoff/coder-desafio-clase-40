import { cartDAO } from "../DAO/cartDAO.js";
import { userDAO } from "../DAO/userDAO.js";

function getTotalPrice(products){
    let totalPrice = 0
    if (products.length > 0){
        products.forEach(prod => {
            totalPrice += (prod.price * prod.quantity)
        });
    }

    return totalPrice
}

const cartControllerGet = async (req, res) => {
    try {
        console.log("entro al GET: ")
        const idCart = req.params.id
        const cart = await cartDAO.getById(idCart)
        const products = cart.products
        const username = cart.user
        console.log("cartID: ", idCart)
        console.log("username: ", username)
        const totalPrice = getTotalPrice(products)
        const avatar = await userDAO.getUserAvatarById(username)
        
        res.render("cartTemplate.ejs", { username, products, totalPrice, idCart, avatar })
    } catch (error) {
        console.log(error)
    }
}

const cartControllerPost = async (req, res) => {
    try {
        const cartResponse = await cartDAO.createDocument()
        res.send(`${cartResponse}`)
    } catch (error) {
        console.log(error)
    }

}

const cartControllerProductsPost = async (req, res) => {
    try {
        const cartId = req.params.id
        const bodyCart = req.body
        console.log("cartId: ", cartId)
        console.log("bodyCart: ", bodyCart)

        let cart = await cartDAO.getById(cartId)
        console.log("cart:")
        console.log(cart)
        cart.products.push(bodyCart)
        console.log(cart)
        const totalPrice = getTotalPrice(cart.products)
        cart.totalPrice = totalPrice
        cart.cartId = cartId
        
        const cartResponse = await cartDAO.updateDocument(cartId, cart)
        console.log("cartResponse: ", cartResponse)

        console.log("Redireccionando al carrito: ", cartId)
        return res.status(200).redirect(`/api/carts/${cartId}/products`);
        //res.send(`${cartResponse}`)
    } catch (error) {
         console.log(error)
    }
}

const cartControllerDelete = async (req, res) => {
    try {
        const cartId = req.params.id
        const cartResponse = await cartDAO.deleteById(cartId)

        res.send(cartResponse)
    } catch (error) {
        console.log(error)
    }
}

const cartControllerProductDelete = async (req, res) => {
    try {
        const cartId = req.params.id
        const productId = req.params.id_prod

        const cartResponse = await cartDAO.deleteProductInCart(cartId, productId)

        res.send(cartResponse)
        
    } catch (error) {
        console.log(error)
    }
}

export { cartControllerGet, cartControllerPost, cartControllerProductsPost, cartControllerDelete, cartControllerProductDelete }