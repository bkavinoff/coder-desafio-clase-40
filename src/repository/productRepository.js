import BaseRepository from "./baseRepository.js";
//import { Product } from "../models/productsModel.js"

class ProductRepository extends BaseRepository {
    constructor(Product){
        super(Product)
    }
}

export default ProductRepository