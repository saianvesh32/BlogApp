const exp=require('express');
const authorApp=exp.Router();
const {createUserorAuthor,UserorAuthorLogin}=require('./Util')
const expressAsyncHandler=require('express-async-handler')
const verifyToken=require('../Middelwares/VerifyToken')

let articlesCollection;
let authorsCollection;
authorApp.use((req,res,next)=>{
    authorsCollection=req.app.get('authorsCollection')
    articlesCollection=req.app.get('articlesCollection')
    next()
})

//define a route
authorApp.post('/user',createUserorAuthor)

//login route
authorApp.post('/login',expressAsyncHandler(UserorAuthorLogin))


//save a new article
authorApp.post('/new-article',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get article from client
    const newArticle=req.body;
    //save new article
    await articlesCollection.insertOne(newArticle);

    //send res
    res.send({message:"new Article added"})
}))

//read articles by authors username
authorApp.get('/articles/:username',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get authors username
    const usernameofAuthor=req.params.username;
    //get articles of current author
    const articleList=await articlesCollection.find({username:usernameofAuthor}).toArray()
//send res
res.send({message:"Articles",payload:articleList})

}))

//edit article
authorApp.put('/article',verifyToken,expressAsyncHandler(async(req,res)=>{
    let modifiedArticle=req.body;
    let articleAfterModification=await articlesCollection.findOneAndUpdate({articleId:modifiedArticle.articleId},{$set:{...modifiedArticle}},{returnDocument:'after'})
    console.log(articleAfterModification);
    res.send({message:"Article modified",payload:articleAfterModification})
}))
module.exports=authorApp;

//delete article
authorApp.put('/article/:articleId',verifyToken,expressAsyncHandler(async(req,res)=>{
    // let articles=req.body;
    // await articlesCollection.updateOne({articleId:articles.articleId},{$set:{...articles}})
    // res.send({message:"Article deleted"})
    let articleIdofUrl=Number(req.params.articleId)
    let art=req.body;
    if(art.status===true){
        let result=await articlesCollection.updateOne({articleId:articleIdofUrl},{$set:{status:false}});
          console.log(result);
        if(result.modifiedCount===1){
            res.send({message:"article deleted"})
        }
    }
    if(art.status===false){
        let result=await articlesCollection.updateOne({articleId:articleIdofUrl},{$set:{status:true}});
     
        if(result.modifiedCount===1){
            res.send({message:"article restored"})
        }
    }

}))