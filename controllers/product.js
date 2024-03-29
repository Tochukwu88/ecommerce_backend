const Product = require('../models/product')
const formidable = require('formidable')
const _ = require('lodash')
const fs = require('fs')
const { errorHandler } = require('../helpers/dberrorHandler')


exports.productById =(req,res,next,id) =>{
    Product.findById(id).populate('category').exec((err,prod) =>{
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
        // const {name,description,price,quantity,shipping,category} = fields
        // if(!name || !description || !price || !quantity || !shipping || !category){
        //     return res.status(400).json({
        //         error:"all fields are required"
        //     })
        // }
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
exports.list = (req,res) =>{
    let order = req.query.order ? req.query.order :'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy :'_id'
    let limit = req.query.limit ? parseInt(req.query.limit) :6
    Product.find({}).select('-photo').populate('category').sort([[sortBy,order]]).limit(limit).exec((err,data)=>{
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        res.json(data)
    })
    
    
    
}
    
exports.relatedProducts = (req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) :6
    Product.find({_id:{$ne: req.product}, category:req.product.category}).select('-photo').populate('category', '_id name').limit(limit)
    .exec((err,data) =>{
        if(err){
            return res.status(400).json({
                error:'products not found'
            })
        }
        res.json(data)
    })

}    
exports.listCategories = (req,res) =>{
    Product.distinct('category',{},(err,data) =>{
        if(err){
            return res.status(400).json({
                error:'products not found'
            })
        }
        res.json(data)

    })
}

 
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 8;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters)-
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};
exports.photo = (req,res,next) =>{
    if(req.product.photo.data){
        res.set('Content-Type',req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }
    next()
}
 exports.searchedList =  (req,res) =>{
    const query = {}
    if(req.query.search){
        query.name= {$regex: req.query.search, $options:'i'}
        if(req.query.category && req.query.category != 'All'){
            query.category = req.query.category
        }
        Product.find(query,(err,p) =>{
            if(err){
                res.status(400).json({
                    error:errorHandler(err)
                })
            }
            res.json(p)
        }).select('-photo')
    }
}
exports.decreaseQuantity =(req,res,next) =>{
    let bulkOps = req.body.order.products.map((item)=>{
        return{
            updateOne:{
                filter:{_id:item._id},
                update:{$inc:{quantity:-item.count, sold: +item.count}}
            }
        }
    })
    Product.bulkWrite(bulkOps,{},(error,products) =>{
        if(error){
            return res.status(400).json({
                error:'could not update product'
            })
        }
        next()
    })
}