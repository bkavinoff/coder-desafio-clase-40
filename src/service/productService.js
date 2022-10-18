import productDAO from "../DAO/productDAO.js"
const prod = productDAO.getInstance()
const getAllProducts = async () => {
    const products = await prod.getAll()
    return products
}

const getOneProductById = async (id) => {
    const products = await prod.getById(id)
    return products
}

const postNewProduct = async (newProduct) => {
   if (typeof newProduct.title !== "string") throw "Title must be string";
   if (typeof newProduct.price !== "number") throw "Price must be number";
   if (typeof newProduct.stock !== "number") throw "Stock must be number";

    await prod.createDocument(newProduct)
    return
}

export { getAllProducts, getOneProductById, postNewProduct }
