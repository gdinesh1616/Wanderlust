const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.addNewReview = async(req,res)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = res.locals.user._id;
    listing.review.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","review is saved");
    res.redirect(`/listings/${id}`);
}




module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {review: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review is deleted");
    res.redirect(`/listings/${id}`);
}