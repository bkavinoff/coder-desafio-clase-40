import { Router } from "express";
import { productsTest } from "../controller/testController.js";
import { getAllProductsController,getOneProductController, postNewProductController } from "../controller/productsController.js";
import { cartControllerGet, cartControllerPost, cartControllerProductsPost, cartControllerDelete, cartControllerProductDelete } from "../controller/cartController.js";
import { loginController, postUserLogin } from "../controller/loginController.js";
import { registerController, postNewUser } from "../controller/registerController.js";
import { successLoginController } from "../controller/successLoginController.js";
import { loginMiddleware } from "../middleware/loginMiddleware.js";
import { logOutController } from "../controller/logOutController.js";
import { chatController } from "../controller/chatController.js";
import { errorLoginController, errorRegisterController} from "../controller/errorLoginController.js"
import passport from 'passport';
import { informationController } from '../controller/informationController.js';
import { randomsController } from '../controller/randomsController.js';
import { postNewOrder, orderControllerDelete} from "../controller/orderController.js"

import { upload } from '../middleware/multerMiddleware.js';

const router = Router()

//Rutas de carritos
router.get('/carts/:id/products', cartControllerGet)
router.post('/carts', cartControllerPost)
router.post('/carts/:id/products', cartControllerProductsPost)
router.delete('/carts/:id', cartControllerDelete)
router.delete('/carts/:id/products/:id_prod', cartControllerProductDelete)

//chat
router.get('/chat', loginMiddleware, chatController)

//Rutas de error login/registro
router.get('/error-login', errorLoginController)
router.get('/error-register', errorRegisterController)

//Rutas Login
router.get('/login', loginController)
router.get('/loginSuccess', successLoginController)

router.post('/login', passport.authenticate("login", { failureRedirect: "/api/error-login" }), postUserLogin )

//logout
router.get('/logout', loginMiddleware, logOutController)

//Rutas Registro
router.get('/register', registerController)
router.post('/register', upload.single("userAvatar"), passport.authenticate("register", { failureRedirect: "/api/error-register" }), postNewUser)

//Rutas de Producto
router.get('/products', loginMiddleware, getAllProductsController)
router.get('/products/all', loginMiddleware, getAllProductsController)
router.get('/products/:id', loginMiddleware, getOneProductController)
router.post('/products', loginMiddleware, postNewProductController )

//Rutas de Order
router.post('/order/:idCart', postNewOrder )

//Rutas Test
router.get('/products-test', loginMiddleware, productsTest)

router.get('/info', informationController)
router.get('/randoms', randomsController)





export default router
