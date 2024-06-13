const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bycrypt = require("bcryptjs")
const {blogmodel}=require("./models/signup")
const jwt = require("jsonwebtoken")

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://anusha:anusha13@cluster0.hyxpaoy.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword=async(password)=>{
    const salt=await bycrypt.genSalt(10)
    return bycrypt.hash(password,salt)
}
//api for signUp
app.post("/add",async(req,res)=>{
    let input = req.body
    let hashedPassword = await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password = hashedPassword
    let blog = new blogmodel(input)
    blog.save()
    res.json({"status":"success"})
})
//api for signIn
app.post("/signin",(req,res)=>{
    let input = req.body
    blogmodel.find({"email":req.body.email}).then(
        (response)=>{
           if (response.length>0) {
            let dbpassword=response[0].password
            console.log(dbpassword)
            bycrypt.compare(input.password,dbpassword,(error,isMatch)=>{
                if (isMatch) {
                   jwt.sign({email:input.email},"blog-app",{expiresIn:"1d"},(error,token)=>{
                    if (error) {
                        res.json({"status":"unable to create token"})
                    } else {
                        res.json({"status":"success","userId":response[0]._id,"token":token})
                    }
                   })
                } else {
                    res.json({"status":"incorrect"})
                }
            })
           } else {
            res.json({"status":"user not found"})
           }
        }
    ).catch()
})

app.post("/search",(req,res)=>{
    res.json({"status":"success"})
})

app.listen(8081,()=>{
    console.log("server started")
})