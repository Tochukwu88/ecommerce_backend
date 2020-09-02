const express = require('express')

const {checkToken,authAdminUser,authregUser} = require('../controllers/auth.js')
const {createProduct,productById,singleProduct,deleteProduct,updateProduct,list,relatedProducts,
    listCategories,listBySearch,photo,searchedList} = require('../controllers/product.js')
const {userById} = require('../controllers/user.js')

const router = express.Router();
router.get('/products',list)
router.get('/products/related/:productId', relatedProducts)
router.get('/products/categories', listCategories)
router.get('/products/search', searchedList)
router.get('/product/:productId', singleProduct)
router.get('/product/photo/:productId',photo)
router.delete('/product/delete/:productId/:userId', checkToken,authregUser,deleteProduct)
router.put('/product/update/:productId/:userId', checkToken,authregUser,updateProduct)
router.post('/product/create/:userId',checkToken,authAdminUser,createProduct)
router.post("/products/by/search", listBySearch);
router.param("userId",userById)
router.param("productId",productById)
  




module.exports = router