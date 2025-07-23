const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    credits: {
    type: Number,
    default: 5
}
});

const User=mongoose.model('users',UserSchema);
module.exports=User;