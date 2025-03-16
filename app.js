const express = require('express');
const path = require('path');
const app = express();
// const cors = require("cors");
// app.use(cors({
//   origin: "*",
//   credentials: true
// }));
const cookieParser =require('cookie-parser');
app.use(cookieParser());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const userModel = require('./usermodule')
const postModel = require('./post');
// const { console } = require('inspector');
app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view.engine','ejs');
// const PORT = process.env.PORT || 3000;

// app.use(cors({
//     origin: "https://user-data-dun.vercel.app/", // Replace with your Vercel domain
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
            res.redirect('/');
        })
    })
})
app.get('/logout',async(req,res)=>{
   res.cookie("token","");
   res.redirect('/');
})
app.get('/viewdata',async(req,res)=>{
    let users = await userModel.find();
    res.render("data.ejs",{users : users });
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
            return res.redirect('/profile');
        } else {
            return res.status(401).send("something wents wrong...");
        }
    })
    
})
app.get('/profile',isloggedin, async (req,res)=>{
    let user = await userModel.findOne({kerbors_id : req.user.id}).populate("posts");;
    // console.log(user);
    return res.status(200).render("profile.ejs",{user:user});

})
app.post('/:user_id/createpost' , async(req,res)=>{
    let author = req.params.user_id;
    let post = await postModel.create({
        author :author ,
        content : req.body.content
    })
    let user = await userModel.findOne({_id : author});
    console.log(user)
    user.posts.push(post._id);
    await user.save();
    console.log(post);
    console.log("is it working")
    res.redirect('/profile');
}) 

function isloggedin(req,res,next){
    if (req.cookies.token === "") {
        res.redirect('/')
    }
    else{
        let data = jwt.verify(req.cookies.token , "dfvdouyvgh");
        req.user = data ;
    }
    next()
}
app.get("/:post_id/likepost/:user_id",async (req,res)=>{
    
    let post = await postModel.findOne({_id : req.params.post_id});
    if (post.likes.includes(req.params.user_id)  ){
        post.likes.pull(req.params.user_id);
    }
    else{
        post.likes.push(req.params.user_id);
    }
    await post.save();
    // console.log(req.params.user_id)
    // console.log(post)
    res.redirect("/profile")
})
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server started on port ${PORT}`);
// });

app.listen(3000,'0.0.0.0',()=>{
    console.log(`Server started`)
})