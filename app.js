require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const sessionOptions = {
    secret:"mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }

}


app.use(session(sessionOptions));
app.use(flash());
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
})


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/user",userRouter)


const dns = require("dns");
dns.setServers(["1.1.1.1"],["0.0.0.0"])
main()
.then(()=>{console.log("connected to db")})
.catch(err => console.log(err));
async function main() {
    const mongo_url=process.env.MONGO_URL;
  await mongoose.connect(mongo_url);
}

// app.get("/demouser",async(req,res)=>{
//     const fakeuser = new User({
//         email:"student@gmail.com",
//         username: "student1",
//     }) ;

//     let registeredUser = await User.register(fakeuser,"helloworld");
//     res.send(registeredUser);
// })

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page not Found!!"));
})

app.use((err,req,res,next)=>{
    let {statusCode,message} = err;
    res.render("listings/error.ejs",{message,statusCode});
    // res.status(statusCode).send(message);
})

app.listen(8080,()=>{
    console.log("server is running");
})

