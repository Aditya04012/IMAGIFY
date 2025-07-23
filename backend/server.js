const dotenv = require("dotenv");
dotenv.config();
const mongoose=require('mongoose');
const app=require("./app");
const PORT = process.env.PORT 

const DB=process.env.DB;



mongoose.connect(DB).then(() => {
  console.log('MongoDB connection successful');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});


app.listen(PORT ,()=>{
    console.log(`server is live at port ${PORT} `);
})