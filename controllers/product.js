const Product = require('../models/product')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const { errorHandler } = require('../helpers/dberrorHandler')


exports.productById =(req,res,next,id) =>{
    Product.findById(id).exec((err,prod) =>{
        if(err){
            return res.status(400).json({
                error:'product not found'
            })
        }
        req.product = prod
        next()
    })
} 
exports.singleProduct = (req,res) =>{
    req.product.photo = undefined
    return res.json(req.product)
} 

exports.createProduct = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req,(err,fields,files) =>{
       
       
        if(err){
            return res.status(400).json({
                error:'Image could not be uploaded'
            })
        }
        const {name,description,price,quantity,shipping,category} = fields
        if(!name || !description || !price || !quantity || !shipping || !category){
            return res.status(400).json({
                error:"all fields are required"
            })
        }
        let product = new Product(fields)

      
        
        if(files.photo){
            if(files.photo.size > 3000000){
                return res.status(400).json({
                    error:"Image should be less than 3mb"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err,result)=>{
            
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            result.photo = undefined
            res.json(result)
        })


    })
  
}
exports.deleteProduct = (req,res) =>{
    let product = req.product
    product.remove((err,result) =>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json({
            message:" product deleted succesfully"
        })
    })

}
exports.updateProduct = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true

    form.parse(req,(err,fields,files) =>{
       
       
        if(err){
            return res.status(400).json({
                error:'Image could not be uploaded'
            })
        }
        const {name,description,price,quantity,shipping,category} = fields
        if(!name || !description || !price || !quantity || !shipping || !category){
            return res.status(400).json({
                error:"all fields are required"
            })
        }
        let product = req.product
        product = _.extend(product,fields)

      
        
        if(files.photo){
            if(files.photo.size > 3000000){
                return res.status(400).json({
                    error:"Image should be less than 3mb"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }

        product.save((err,result)=>{
            
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            result.photo = undefined
            res.json(result)
        })


    })
  
}