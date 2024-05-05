const exp=require('express');
const adminApp=exp.Router();

//define a route
adminApp.get('/test-admin',(req,res)=>{
res.send({message:"from adminapi"});
})

module.exports=adminApp;