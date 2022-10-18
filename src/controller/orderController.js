import { orderDAO } from "../DAO/orderDAO.js";
import { cartDAO } from "../DAO/cartDAO.js";
import { userDAO } from "../DAO/userDAO.js";
import { mailOptions, transporter } from "../middleware/nodemailer.js";
import { smsClient, smsOptions } from "../middleware/twilioSms.js";
import { whatsappClient, whatsappOptions } from "../middleware/twilioWatsapp.js";
import productDAO from "../DAO/productDAO.js";
const prod = new productDAO()

const enviarMensajes = async (order) => {
    try {
        //enviamos mail al admin
        mailOptions.subject = `Nuevo pedido de ${order.username} (email: ${order.email})`
        mailOptions.html = `<h1>Nuevo pedido de ${order.username} (email: ${order.email})</h1>
        <h2>Productos comprados:</h2>
        `
                            
        order.products.forEach( async product => {
            
            const fullProduct = await prod.getById(product.productId)

            mailOptions.html +=(`
            <br>
            <ul>title: ${fullProduct.title}</ul>
            <ul>productId: ${product.productId}</ul>
            <ul>price: ${fullProduct.price}</ul>
            <ul>quantity: ${product.quantity}</ul>
            <ul>total: ${(fullProduct.price * product.quantity)}</ul>
            <br>
            `)
        })
        
        //await transporter.sendMail(mailOptions)
        

        //enviamos whatsapp al admin
        // whatsappOptions.body = `
        // Nuevo pedido de ${order.username} (email: ${order.email})
        // Prodcutos comprados:
        // `
        // order.products.forEach( async product => {
        //     const fullProduct = await prod.getById(product.productId)
        //     whatsappOptions.body +=(`
        //         title: ${fullProduct.title}
        //         productId: ${product.productId}
        //         price: ${fullProduct.price}
        //         quantity: ${product.quantity}
        //         total: ${(fullProduct.price * product.quantity)}
        //     `)
        // })
        // await whatsappClient.messages.create(whatsappOptions)
        
        // //enviamos SMS al user
        // smsOptions.body += `${order.username}, tu pedido se esta procesando :)`
        // smsOptions.to += `${order.phoneNumber}`

        // await smsClient.messages.create(smsOptions)

        //proceso de vaciado de carrito
        
        const cartId = order.cartId
        const cartToUpdate = await cartDAO.getById(cartId)
        cartToUpdate.products = []
        await cartDAO.updateDocument(cartId, cartToUpdate)

        //redireccion al home del user
        res.redirect("/api/products")
    } catch (error) {
        console.log(error)
    }
}

const postNewOrder = async (req, res) => {
    console.log("entro a newOrder")
    const cartId = req.params.idCart
    console.log("cartId: ", cartId)
    const userCart = await cartDAO.getById(cartId)
    console.log("userCart: ", userCart)
    const user = await userDAO.getById(userCart.user)
    console.log("user: ", user)

    const newOrder = {
        username: user.username,
        name: user.firstName,
        lastname: user.lastName,
        email: user.email,
        address: user.address,
        phoneNumber: user.userPhone,
        products: userCart.products,
        totalPrice: userCart.totalPrice
    }
    console.log("newOrder")
    console.log(newOrder)
    const orderId = await orderDAO.createDocument(newOrder)
    

    //envío de mensajes





    return res.json({message:`Se ha creado la orden: ${orderId}`})
}



const orderControllerDelete = async (req, res) => {
    try {
        const cartId = req.params.id
        const cartResponse = await orderDAO.deleteById(cartId)

        res.send(cartResponse)
    } catch (error) {
        console.log(error)
    }
}



export { postNewOrder, orderControllerDelete}