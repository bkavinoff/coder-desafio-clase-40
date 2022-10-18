import { userDAO } from "../DAO/userDAO.js"
import { cartDAO } from "../DAO/cartDAO.js"
import productDAO from "../DAO/productDAO.js"
import { hashPassword, isValidPassword } from '../utils/hashPasswords.js'
import passport from 'passport';
import { ConnectionPolicyPage } from "twilio/lib/rest/voice/v1/connectionPolicy.js";

const prod = productDAO.getInstance()

const loginController = async (req, res) => {
    const { username } = req.session
    const invalidFields = false
    const invalidCredentials = false
    await res.render("loginTemplate.ejs", { username, invalidFields, invalidCredentials })
    
}

//const postUserLogin = async (req, res) => {


    //---------------------------------------------------------------------------------
    //si el passport.authenticate fue exitoso, asigno la session
    //req.session.username = req.body.username

    //obtengo el cartid del usuario:
    //req.session.cartId = await userDAO.getCartByUsername(req.body.username)
    //console.log("session cart id: ", req.session.cartId)
    
    //console.log('loginController -> req.session.username: ', req.session.username)

    //res.status(200).redirect('/api/products/all');
    //---------------------------------------------------------------------------------
//}

const postUserLogin = async (req, res) => {
    req.session.user = req.body.username
    console.log("Logueando...")
    //obtenemos los datos del usuario que logro logearse y los guardamos en el req.session
    const loggedUser = await userDAO.getByUsername(req.session.user)
    const loggedUserId = await userDAO.getUserIdByUsername(req.session.user)
    
    req.session.email = loggedUser.email
    req.session.userId = loggedUserId
    req.session.phoneNumber = loggedUser.phoneNumber
    //req.session.avatar = loggedUser.avatar

    //obtenemos los datos del carrito del user que logro logearse y guardamos su id en el req.session
    //try{
        console.log("userID: ", loggedUserId)
        console.log("obteniendo Carrito")
        const loggedUserCart = await cartDAO.getByUserId(loggedUserId)
        req.session.cartId = loggedUserCart._id.toString()
        console.log("carrito OK")
    //}catch(err){
        
    //}
    //datos que necesito para renderizar el listado de productos
    const username = req.session.user
    console.log("obteniendo Productos")
    const products = await prod.getAll()
    console.log("productos OK")
    const invalidProduct = false;
    const cartId = req.session.cartId
    const avatar = loggedUser.avatar

    res.render("productsTemplate.ejs", { username, cartId, products, invalidProduct, avatar })
}



export { loginController, postUserLogin }