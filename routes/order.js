const express = require('express')

const {checkToken,authAdminUser,authregUser} = require('../controllers/auth.js')
const {userById} = require('../controllers/user.js')
const {create} = require("../controllers/order.js")

const router = express.Router();
router.get('/order/create/',create)

router.param("userId",userById)
  




module.exports = router