const user = require("./models/user.js")
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const router = require("express").Router({ mergeParams: true });


module.exports.isLoggedIn =  (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged ");
        res.redirect("/user/login");
    }else{
        next();
    }
}
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!(res.locals.user._id.equals(listing.owner._id))){
        req.flash("error","This listing is owned by others");
        return res.redirect(`/listings/${id}`);
    }
        next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    console.log(id,reviewId);
    let review = await Review.findById(reviewId).populate("author");
    if(!(review.author._id.equals(res.locals.user._id))){
        req.flash("error","you cannot delete this review");
        return res.redirect(`/listings/${id}`)
    }
        next();

}
