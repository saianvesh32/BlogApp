const exp=require('express');
const userApp=exp.Router();

const {createUserorAuthor,UserorAuthorLogin}=require('./Util');
const expressAsyncHandler = require('express-async-handler');
const verifyToken=require('../Middelwares/VerifyToken')

let articlesCollection;
userApp.use((req,res,next)=>{
    userCollection=req.app.get('userCollection')
    articlesCollection=req.app.get('articlesCollection')
    next()
})
//define routes
userApp.post('/user',createUserorAuthor)
//login route
userApp.post('/login',UserorAuthorLogin)

//read articles
userApp.get('/articles',verifyToken,expressAsyncHandler(async(req,res)=>{
    const ArticlesList=await articlesCollection.find({status:true}).toArray()
    res.send({message:"All articles",payload:ArticlesList})
}))

//comments
userApp.post('/comment/:articleId',expressAsyncHandler(async(req,res)=>{
    const articleIdFromUrl=(+req.params.articleId);//converting to number
    const userComment=req.body;
    await articlesCollection.updateOne({articleId:articleIdFromUrl},{$addToSet:{comments:userComment}})
    res.send({message:"user comment added"})
}))
module.exports=userApp;