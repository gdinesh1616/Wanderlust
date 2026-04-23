const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const {isLoggedIn , isOwner, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js")


let validatereviewSchema = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        console.log(error);
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

//REVIEW ROUTE
router.post("/",isLoggedIn,validatereviewSchema, wrapAsync(reviewController.addNewReview))
//DELETE REVIEW ROUTE
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports  = router;