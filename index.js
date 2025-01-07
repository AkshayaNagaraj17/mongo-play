const express=require("express")
const app=express()
const mongoose=require("mongoose")
const {UserModel,TodoModel}=require("./db")
const jwt_secret="aksh1730"
const jwt=require("jsonwebtoken")

mongoose.connect("mongodb+srv://cnagaraj332:vis4NvH3ZRr97kDU@cluster0.y65wu.mongodb.net/todo-aksh")
app.use(express.json())


function auth(req,res,next)
{
    const token=req.headers.token;
    const decoded=jwt.verify(token,jwt_secret)

    if(decoded)
    {
        req.userId=decoded.id //have to give id
        next()
    }
    else
    {
        res.status(403).json({
            message:"baddd"
        })
    }
}
app.post("/signup",async function(req,res)
{
    const email=req.body.email;
    const name=req.body.name;
    const password=req.body.password;

    await UserModel.create(  // without this await the response will not be given
        {
            email:email,
            name:name,
            password:password
        }
    )
    res.json({
        message:"You are signed up"
    })

})


app.post("/signin", async function(req,res)
{
    const email=req.body.email;
    const password=req.body.password;

    const user= await UserModel.findOne(
        {
            email:email,
            password:password
        }
    )
    console.log(user)
    if (user)
    {
        const token=jwt.sign(
            {id:user._id.toString()}   //id:user.  format

            ,jwt_secret)
            res.json(
                {
                    token:token
                }
            )
    }
 
    else
    {
        res.status(403).json(
            {
                message:"Bad login"
            }
        )
    }

})

app.post("/todo",auth,async function(req,res)
{
    const userId=req.userId;
    const title=req.body.title;
    const done=req.body.done

    await TodoModel.create(
        {
            userId,
           title,
            done
        }
    )
    res.json(
        {
            message:"todo craeted"
        }
    )

})

app.get("/todos",async function(req,res)
{
    const userId=req.userId
    const todos=await TodoModel.find({
        userId
    })
    res.json({
        todos:todos
    })
    
})

app.listen(3007)