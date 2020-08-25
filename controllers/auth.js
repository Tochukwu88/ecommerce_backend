const User = require('../models/user')
const {errorHandler} = require('../helpers/dberrorHandler')
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')
require('dotenv').config()


exports.signup = (req,res) =>{
    const {name,email,password} = req.body
    console.log(name,email,password)
    const newUser = new User({name,email,password})
    newUser.save((err,user) =>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        user.salt = undefined
        user.hashed_password = undefined
        return res.json(user
           
        )
    })

    
}
exports.signin = (req,res) =>{
    const {email,password} = req.body
    User.findOne({email}).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:'user does not exist'
            })
        }

        if(!user.authenticate(password)){
            return res.status(400).json({
                error:'email and password do not match'
            })
        }
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})
        res.cookie('token' , token, {expiresIn:'1d'})
        const {_id,name,email,role} = user

      return  res.json({
            token,
            user: _id,name,email,role
        })

    })
}
exports.signout = (req,res) =>{
    res.clearCookie('token')
    res.json({
        message:'signout successful'
    })
}
exports.checkToken = expressJWT({
    secret:process.env.JWT_SECRET,algorithms: ['HS256'],
    userProperty:"auth"
})
exports.authregUser = (req,res,next) =>{
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if(!user){
        return res.status(403).json({
            error:'please login'
        })
    }
    next()
}
exports.authAdminUser = (req,res,next) =>{
    if(req.profile.role === 0){
        return res.status(403).json({
            error:'Admin resource . acces denied'
        })
    }
    next()
}