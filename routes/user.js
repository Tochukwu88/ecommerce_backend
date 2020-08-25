const express = require('express')

const {checkToken,authAdminUser,authregUser} = require('../controllers/auth.js')
const {userById} = require('../controllers/user.js')

const router = express.Router();
router.get('/secret/:userId',checkToken,authregUser,(req,res)=>{
    res.json({
        user:req.profile
    })
})
router.param("userId",userById)
  




module.exports = router