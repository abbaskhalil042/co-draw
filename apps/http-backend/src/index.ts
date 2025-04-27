import express from "express";

const app=express()


app.post("/signup",async(req,res)=>{
    console.log(req.body)
    res.send("Hello")
})

app.post("/signin",async(req,res)=>{
    console.log(req.body)
    res.send("Hello")
})

app.post("/room",async(req,res)=>{
    console.log(req.body)
    res.send("Hello")
})


app.listen(4000,()=>{
    console.log("Server is running on port 3000")
})