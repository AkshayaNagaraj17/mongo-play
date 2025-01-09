const express=require("express")
const app=express()
const mongoose=require("mongoose")
const {UserModel,TodoModel}=require("./db")
const jwt_secret="aksh1730"
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

mongoose.connect("mongodb+srv://cnagaraj332:vis4NvH3ZRr97kDU@cluster0.y65wu.mongodb.net/todo-aksh")
app.use(express.json())


function auth(req,res,next)
{
    const token=req.headers.token;
    const decoded=jwt.verify(token,jwt_secret)
    if(decoded)
    {
        req.userId=decoded.id //have to give id
        next( )
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

    const hashedPword=await bcrypt.hash(password,5);
    console.log(hashedPword)
    await UserModel.create(  // without this await the response will not be given
        {
            email:email,
            name:name,
            password:hashedPword
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
            
        }
    )

    if(!user)
    {

        res.status(403).json(
            {
                message:"User not found"
            }
        )
    }
    const matchPword=await bcrypt.compare(password,user.password) //checking whether password matches
    if (matchPword)
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

app.get("/todos",auth,async function(req,res)
{
    const userId=req.userId
    const todos=await TodoModel.find({
        userId

    })
    res.json({
        todos:todos
    })
    
})


app.put("/todo/:id",auth,async function(req,res)
{
    const todoid=req.params.id;
    const userId=req.userId
    const{title,done}=req.body

    const todo=await TodoModel.findByIdAndUpdate({ _id: todoid, userId },{title,done},{new:true})
    if (todo)
    {
        res.json({
            message:"Todo updated",todo
        })
    }
    else {
        res.status(404).json({ message: "Todo not found" });
    }
})
app.delete("/todo/:id",auth,async function(req,res)
{
    const id=req.params.id;
    const userId=req.userId
    
    const todo=await TodoModel.findByIdAndDelete({_id:id,userId})
    if (todo)
    {
        res.json({
            message:"Todo updated",todo
        })
    }
    else {
        res.status(404).json({ message: "Todo not found" });
    }
})
app.listen(3007)