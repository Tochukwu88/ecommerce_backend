const express = require('express')

const {checkToken,authAdminUser,authregUser} = require('../controllers/auth.js')
const { verifypay} = require('../controllers/paystack')
const {userById} = require('../controllers/user.js');


const router = express.Router();
  
  router.post('/paystack/verify', verifypay)




  router.param("userId",userById)



module.exports = router