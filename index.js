const express=require("express")
const app=express()
const mongoose=require("mongoose")
const {UserModel,TodoModel}=require("./db")
const jwt_secret="aksh1730"
const jwt=require("jsonwebtoken")

mongoose.connect("mongodb+srv://cnagaraj332:vis4NvH3ZRr97kDU@cluster0.y65wu.mongodb.net/todo-aksh")
app.use(express.json())


app.post("/signup",async function(req,res)
{
    const email=req.body.email;
    const name=req.body.name;
    const password=req.body.password;

    await UserModel.create(
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
            {id:user_id}
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

app.post("/todo",function(req,res)
{

})

app.get("/todos",function(req,res)
{

})

app.listen(3007)