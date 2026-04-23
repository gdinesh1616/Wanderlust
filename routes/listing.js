const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("../schema.js");
const {isLoggedIn , isOwner} = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const multer  = require('multer')
const {storage}= require("../cloudConfig.js")
const upload = multer({ storage });



let validatelistingSchema = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        console.log(error);
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
router.get("/new",isLoggedIn,listingcontroller.renderNewListingForm)

router.route("/")
.get(listingcontroller.index)
.post(isLoggedIn,validatelistingSchema,upload.single('listing[img]'), wrapAsync(listingcontroller.createNewListing));

router.route("/:id")
.get(listingcontroller.showListing)
.put(isLoggedIn,upload.single('image'),wrapAsync(listingcontroller.updateEditInfo));
//new route
//edit route
router.get("/:id/edit",isLoggedIn,isOwner,listingcontroller.editListingForm);
//DELETE ROUTE
router.delete("/:id/delete",isLoggedIn,isOwner,listingcontroller.destroyListing);

module.exports  = router;