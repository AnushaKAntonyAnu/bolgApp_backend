const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bycrypt = require("bcryptjs")
const {blogmodel}=require("./models/signup")


const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://anusha:anusha13@cluster0.hyxpaoy.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword=async(password)=>{
    const salt=await bycrypt.genSalt(10)
    return bycrypt.hash(password,salt)
}

app.post("/add",async(req,res)=>{
    let input = req.body
    let hashedPassword = await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password = hashedPassword
    let blog = new blogmodel(input)
    blog.save()
    res.json({"status":"success"})
})

app.post("/view",(req,res)=>{
    res.send("view")
})

app.post("/search",(req,res)=>{
    res.send("search")
})

app.listen(8081,()=>{
    console.log("server started")
})