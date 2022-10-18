//


//import productService from "../service/productService.js"
import { getAllProducts, getOneProductById, postNewProduct } from "../service/productService.js"

const getAllProductsController = async (req, res) => {
    const userSession  = req.session
    const invalidProduct = false;
    const username = userSession.user
    const cartId = userSession.cartId

    const products = await getAllProducts()

    res.render("productsTemplate.ejs", { username, cartId, products, invalidProduct })
}

const getOneProductController = async (req, res) => {
    const { id } = req.params
    const userSession  = req.session
    const username = userSession.username
    const cartId = userSession.cartId
    const invalidProduct = false;

    const products = await getOneProductById(id)

    res.render("productsTemplate.ejs", { username, cartId, products, invalidProduct })
}

const postNewProductController = async (req, res) => {
    const newProduct = req.body
    const userSession  = req.session
    const username = userSession.username
    const cartId = userSession.cartId
    let invalidProduct = false;

    //verifico que lleguen todos los campos
    if(newProduct.title === '' || newProduct.stock === '' || newProduct.price === '' || newProduct.code === '' || newProduct.description === '' || newProduct.thumbnail === ''){
        invalidProduct = true
    }else{
        await postNewProduct(newProduct)
    }

    const products = await productDAO.getAll()

    res.render("productsTemplate.ejs", { username, cartId, products, invalidProduct })
}

export { getAllProductsController, getOneProductController, postNewProductController }