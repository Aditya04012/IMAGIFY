const express=require('express');

const {signup,login,protect,CreateImage,getUser}=require('../controllers/userControlles')

 const router=express.Router();
  

router.post('/signup',signup);
router.post('/login',login);
router.post('/image',protect,CreateImage);
router.get('/getuser',protect,getUser);
module.exports=router;