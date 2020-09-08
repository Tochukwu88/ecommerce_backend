const express = require('express')

const {checkToken,authAdminUser,authregUser} = require('../controllers/auth.js')
const {userById,populateUserHistorywithOrder} = require('../controllers/user.js')
const {create,listOrders,getStatusValues,opdateOrderStatus,orderById} = require("../controllers/order.js")
 
const {decreaseQuantity} = require('../controllers/product')

const router = express.Router();
router.post('/order/create/:userId',checkToken,authregUser,populateUserHistorywithOrder,decreaseQuantity,create)
router.get('/order/list/:userId',checkToken,authAdminUser,listOrders)
router.get('/order/staus-values/:userId',checkToken,authAdminUser,getStatusValues)
router.put('/order/:orderId/status/:userId',checkToken,authAdminUser,opdateOrderStatus)


router.param("userId",userById)
router.param("orderId",orderById)
  




module.exports = router