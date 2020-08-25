const express = require('express')

const {signup,signin,signout} = require('../controllers/auth.js')
const { userValidationRules,
    
   validate,signinValidationRules,
   signinvalidate} =require('../validators/index')

const router = express.Router();
   router.post('/signup',userValidationRules(),validate, signup)
   router.post('/signin',signinValidationRules(),
   signinvalidate,signin)
   router.get('/signout',signout)




module.exports = router