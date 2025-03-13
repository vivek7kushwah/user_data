const express = require('express');
let app = express();
const path = require('path');

const userModel = require('./usermodule');
app.get('/',(req,res)=>{
    res.send("hello");
})
app.get('/create',async (req,res)=>{
    let user = await userModel.create({
        name : "vivek",
        email : "vivekkushwah1412@gmail.com",
        username : "vivek14122005"
    })
    res.send(user);
    console.log("user created")
})
app.get('/update',async (req,res)=>{
    let updateduser = await userModel.findOneAndUpdate({name : "vivek"},{name : "vivek kushwah"},{new : true})
    res.send(updateduser);
    console.log("user updatted");
})
app.get('/read',async (req,res)=>{
    let users = await userModel.find();
    res.send(users);
    console.log("user updatted");
})
app.get('/delete',async (req,res)=>{
    let user = await userModel.findOneAndDelete({name : "vivek"});
    res.send(user);
    console.log("user deleted");
})
app.listen(3000,(err)=>{
    console.log("it started");
})