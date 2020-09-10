const express = require('express')

const {checkToken,authAdminUser,authregUser} = require('../controllers/auth.js')
const {userById,getUser,updateUser,purchaseHistory} = require('../controllers/user.js')

const router = express.Router();
router.get('/user/:userId',checkToken,authregUser,getUser)
router.put('/user/:userId',checkToken,authregUser,updateUser)
router.get('/user/orders/by/user/:userId',checkToken,authregUser,purchaseHistory)
router.param("userId",userById)
  




module.exports = router