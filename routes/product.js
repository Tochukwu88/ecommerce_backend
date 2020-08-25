const express = require('express')

const {checkToken,authAdminUser,authregUser} = require('../controllers/auth.js')
const {createProduct,productById,singleProduct,deleteProduct,updateProduct} = require('../controllers/product.js')
const {userById} = require('../controllers/user.js')

const router = express.Router();
router.get('/product/:productId', singleProduct)
router.delete('/product/delete/:productId/:userId', checkToken,authregUser,deleteProduct)
router.put('/product/update/:productId/:userId', checkToken,authregUser,updateProduct)
router.post('/product/create/:userId',checkToken,authAdminUser,createProduct)
router.param("userId",userById)
router.param("productId",productById)
  




module.exports = router