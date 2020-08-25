const Category = require("../models/category")
const { errorHandler } = require("../helpers/dberrorHandler")

exports.createCategory = (req,res)=>{
    name = req.body.name

     const newCat = new Category({name})
     newCat.save((err,cat)=>{
         
         if(err){
            
          return   res.status(400).json({
                 error:errorHandler(err)
             })
         }
         return res.json(cat)
     })

}
exports.catById =(req,res,next,id) =>{
    Category.findById(id).exec((err,result)=>{
        if(err || !result){
            return   res.status(400).json({
                error:"category does not exist"
            })

        }
        req.category  = result
        next()
    })
}
exports.singleCategory = (req,res) =>{
   return res.json(req.category)
}
exports.deleteCategory = (req,res) =>{
    category = req.category
    category.remove((err,result) =>{
        if(err){
            return res.status(400).json({
                error:"failed"
            })
        }
        res.json({
            message:"category deleted succefully"
        })
    })
}
exports.updateCategory = (req,res) =>{
    category = req.category._id
   Category.findByIdAndUpdate(category, { name: req.body.name }).exec((err,result) =>{
       if(err){
           return res.status(400).json({
               error:errorHandler(err)
           })
       }
       res.json({message:'update succefully'})
   })
   
   
}
exports.allCategory = (req,res) =>{
    Category.find({}).exec((err,result) =>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json(result)
    })
}