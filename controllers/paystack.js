
const request = require('request')
const { verifyPayment} = require('../config/paystack')(request);


exports.verifypay = (req,res)=>{
  
    verifyPayment( req.body.reference,(err,result)=>{
        if(err){
            res.status(400).json({
                error:err
            })
        }
        return res.json(result)

    })
}

