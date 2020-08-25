const express = require('express')

const {checkToken,authAdminUser,authregUser} = require('../controllers/auth.js')
const {createCategory,catById,singleCategory,deleteCategory,updateCategory,allCategory} = require('../controllers/category.js')
const {userById} = require('../controllers/user.js')


const router = express.Router();
router.post('/category/create/:userId',checkToken,authAdminUser,createCategory)
router.get('/category/:catId',singleCategory)
router.get('/category',allCategory)
router.put('/category/update/:catId/:userId',checkToken,authAdminUser,updateCategory)
router.delete('/category/delete/:catId/:userId',checkToken,authAdminUser,deleteCategory)
router.param("userId",userById)
router.param("catId",catById)
  




module.exports = router