const exp=require('express')
const app= exp()
const path=require("path")
require('dotenv').config()

// add body parser
app.use(exp.json());

//placing react build in http web server
app.use(exp.static(path.join(__dirname,'../frontend/build')))
//import mongoClient
const mongoClient=require('mongodb').MongoClient;

//connect to mongodb
mongoClient.connect(process.env.DB_URL)
.then(client=>{
//get database object
const blogdbObj=client.db('traveldb')

//create collectionobjects
const userCollection=blogdbObj.collection("users");
const authorsCollection=blogdbObj.collection("authors");
const articlesCollection=blogdbObj.collection("articles");

//share collection 
app.set('userCollection',userCollection)
app.set('authorsCollection',authorsCollection)
app.set('articlesCollection',articlesCollection)

console.log("db connection success");
})
.catch(err=>{
    console.log("err in db connect",err);
})


const userApp=require('./APIs/user-api');
const authorApp=require('./APIs/author-api');
const adminApp=require('./APIs/admin-api');



app.use('/user-api',userApp);
app.use('/author-api',authorApp);
app.use('/admin-api',adminApp);

//error handling
app.use((err,req,res,next)=>{
    res.send({status:"error",message:err.message})
})
const port = process.env.PORT || 7000

app.listen(port,()=>{console.log("server is running on ",port)})
