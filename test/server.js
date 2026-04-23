const express = require("express");
const app= express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(flash());
app.use(session({secret: "mysupersecret",
     resave: false,
     saveUninitialized: true,
}));



app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    console.log(req.session.name);
    req.flash("success","user was registered successfully! ");
    res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
    res.render("index.ejs",{name : req.session.name, msg: req.flash("success")});
})
app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
    req.session.count = 1;}
    res.send(`you have sent request ${req.session.count} times`);
})

app.get("/test",(req,res)=>{
    res.send("test successful!");
})

app.listen(3000,(req,res)=>{
    console.log("server is listening to port 3000")
})