const express=require('express');
const jwt=require('jsonwebtoken');
const AppError=require('../utils/AppError');
const User=require('../models/User')
const axios = require('axios');
const{promisify}=require('util');
const { connect } = require('http2');
const catchAsync=fn=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
  }



exports.signup=catchAsync(async(req,res,next)=>{
 
  const {name,email,password}=req.body;

  if(!name || !email ||!password){
return next(new AppError('Please procide all req fields',400));
  }


 const newUser = await User.create({ name, email, password });

   res.status(200).json({
    status:"suceess",

   });

});

exports.login=catchAsync(async(req,res,next)=>{

const {email,password}=req.body;
   if(!email ||!password){
return next(new AppError('Please provide all req fields',400));
  }
  
  const user=await User.findOne({email});

  if(!user){
    return next(new AppError('User doest not exist plz Sign up',402));
  }

  if(user.password!=password){
      return next(new AppError('Email Or password does not match',402));
  }
  
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN
});
  
res.status(200).json({
    status:"sucess",
    token,
    user
})

});


exports.protect=catchAsync(async(req,res,next)=>{
    //1) getting token and check of its exist there
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token=req.headers.authorization.split(' ')[1];
            
        }
       
    if(!token){
        return next(new AppError("You are not LogedIn !Pleases log in to get access",401));
    }
    
    //2) verification token 
      

     const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET);     //this verify function have callback f(x) has a third agument so we are using promisify built in function and not using callback bcz we are using async await everywhere 
      
    //3) check if user still exists 

       //if token is issued but user deleted itself ...so freshUser will be null (if user is deleted)
         
       const freshUser=await User.findById(decoded.id);

       
      if(!freshUser){
        return next(new AppError('The user belonging to this token does no longer exist',401));
      }
        
        //GRANT ACCESS TO PROTECTED ROUTES
       
        req.user=freshUser;
     
        
    next();
});


exports.CreateImage=catchAsync(async(req,res,next)=>{
  console.log(req.body.prompt)
   const {prompt}=req.body;
   const user=req.user;
  
     if(!prompt || !user){
      return next(new AppError('Missig prompt or login in again',401));
     }

    console.log(prompt);
    console.log(user);

   if(user.credits<=0){
     return next(new AppError('You dont have credits',404));
   }
   
    console.log(prompt);
    console.log(user);
   console.log(user.credits);

    const formData = new FormData();
      formData.append('prompt', prompt);
  
      const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
        headers: { 'x-api-key': process.env.CLIPDROP_API },
        responseType: 'arraybuffer',
      });
  
      const base64Image = Buffer.from(data, 'binary').toString('base64');
      const resultImage = `data:image/png;base64,${base64Image}`;


      const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { credits: -1 } },
      { new: true }
    );

  
  res.status(200).json({
    status:"suceess",
    message: "Image generated successfully",
        creditBalance: user.creditBalance,
        resultImage,

  })
});

exports.getUser=catchAsync(async(req,res,next)=>{
  const user=req.user;
  if(!user){
    return next(new AppError('User not found',404));
  }

  res.status(200).json({
    status:"success",
    user:{
      id:user._id,
      name:user.name,
      email:user.email,
      credits:user.credits
    }
  })
});