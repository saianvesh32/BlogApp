
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
require('dotenv').config()

const createUserorAuthor=async(req,res)=>{
    //get usercollection 
    const userCollectionObj=req.app.get("userCollection")
    const authorCollectionObj=req.app.get("authorsCollection")
    //get user
    const user=req.body;
    if(user.userType==="user")
    {
        let dbuser= await userCollectionObj.findOne({username: user.username});

        //if user existed 
        if(dbuser!=null)
        {
            return res.send({message:"user already existed"});
        }
    }
    if(user.userType==="author")
    {
       
        let dbuser= await authorCollectionObj.findOne({username: user.username});
        //if user existed 
        if(dbuser!=null)
        {
            return res.send({message:"author already existed"});
        }
    }

    //hash password
    const hashedpassword = await bcryptjs.hash(user.password,7)

    //replace plane pass with hashed one
    user.password=hashedpassword;

    //save user
    if(user.userType==="user")
    {
        await userCollectionObj.insertOne(user)
        res.send({message:"User created"})
    }
    if(user.userType=="author")
    {
        await authorCollectionObj.insertOne(user)
        res.send({message:"Author created"})
    }

}

const UserorAuthorLogin=async(req,res)=>{
    //get usercollection 
    const userCollectionObj=req.app.get("userCollection")
    const authorCollectionObj=req.app.get("authorsCollection")
    //get user
    const userCred=req.body;

    if(userCred.userType==="user"){
        //verify username
  
        let dbuser=await userCollectionObj.findOne({username:userCred.username})
        if(dbuser===null){
            return res.send({message:"Invalid username"})
        }else{
            //verify password
            let status = await bcryptjs.compare(userCred.password,dbuser.password)
            if(status===false){
                return res.send({message:"Invalid password"})
            }
            else{
                //create jwt
                let SignedToken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:'100d'})

                delete dbuser.password;

                res.send({message:"login success",token:SignedToken,user:dbuser})

            }
        }
    }
        if(userCred.userType==="author"){
            //verify username
      
            let dbuser=await authorCollectionObj.findOne({username:userCred.username})
            if(dbuser===null){
                return res.send({message:"Invalid author name"})
            }else{
                //verify password
                let status = await bcryptjs.compare(userCred.password,dbuser.password)
                if(status===false){
                    return res.send({message:"Invalid password"})
                }
                else{
                    //create jwt
                    let SignedToken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:'100d'})
    
                    delete dbuser.password;
    
                    res.send({message:"login success",token:SignedToken,user:dbuser})
    
                }
            }

   
}
}

module.exports={createUserorAuthor,UserorAuthorLogin};