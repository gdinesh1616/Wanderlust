const mongoose = require("mongoose");

const schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new schema({
    title:{
        type:String ,
        required: true
    },
    image:{
        path:String,
        filename:String,
    },
    description:String,
    price:Number,
    location:String,
    country:String,
    review:[{
        type: schema.Types.ObjectId,
        ref:"Review"
    }
    ],
    owner:{
        type: schema.Types.ObjectId,
        ref:"User",
    },
    caption: {
    type: String,
    required: true
}
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    console.log(listing);
    if(listing){
    await Review.deleteMany({_id : {$in: listing.review}})}
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
