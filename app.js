const express = require('express');
const path = require('path');
const app = express();
const cookieParser =require('cookie-parser');
app.use(cookieParser());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const fs= require('fs');
const userModel = require('./usermodule');
app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view.engine','ejs');
// const cors = require("cors");
// app.use(cors({
//     origin: "https://user-data-dun.vercel.app", // Replace with your Vercel domain
//     credentials: true
// }));
app.get('/',(req,res)=>{
    res.render("index.ejs");
})

app.post('/create' ,(req,res)=>{
    bcrypt.genSalt(10, (err,salt)=>{
        bcrypt.hash(req.body.possword, salt, async(err,hash)=>{
            let id = req.body.kerbors_id;
            let user = await userModel.create({
                name : req.body.user_name,
                password : hash,
                kerbors_id : id
            })
            
            res.redirect('/viewdata');

        })
    })
    
    
   
})
app.get('/logout',async(req,res)=>{
   res.cookie("token","");
   res.redirect('/');
})
app.get('/viewdata',async(req,res)=>{
    let users = await userModel.find();
    res.render("data.ejs",{ users : users });
})
app.get('/delete/:kerbors_id',async(req,res)=>{
    let user = await userModel.findOneAndDelete({ kerbors_id : req.params.kerbors_id});
    
    res.redirect('/viewdata');
})
app.get('/delete',async(req,res)=>{
    let user = await userModel.findOneAndDelete({ kerbors_id : ''});
    res.redirect('/viewdata');
})
app.post('/login',async(req,res)=>{
    let user = await userModel.findOne({kerbors_id : req.body.kerbors_id});
    if (!user) return res.send("something wents wrong...");
    
    bcrypt.compare(req.body.possword , user.password , function(err, result){
        if (err) {
            console.error("Error during bcrypt comparison:", err);
            return res.status(500).send("Internal server error.");
        }
        if (result) {
            let id = req.body.kerbors_id;
            let token = jwt.sign({id}, "dfvdouyvgh");
            res.cookie("token", token, {
                httpOnly: true,  // Prevents client-side JavaScript access
                secure: true,    // Required for HTTPS
                sameSite: "None" // Allows cross-origin cookies (Vercel → Railway)
            });
            return res.render("data.ejs",{users:user});
        } else {
           
            return res.status(401).send("something wents wrong...");
        }
    })
    
})

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
// });
app.listen(3000,()=>{
    console.log(`Server started`)
})