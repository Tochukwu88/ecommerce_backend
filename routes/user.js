const express = require('express')

const {checkToken,authAdminUser,authregUser} = require('../controllers/auth.js')
const {userById,getUser,updateUser} = require('../controllers/user.js')

const router = express.Router();
router.get('/user/:userId',checkToken,authregUser,getUser)
router.put('/user/:userId',checkToken,authregUser,updateUser)
router.param("userId",userById)
  




module.exports = router