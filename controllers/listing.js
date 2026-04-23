const Listing = require("../models/listing.js");


module.exports.index = async (req,res)=>{
    let allListings = await Listing.find();
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewListingForm = (req,res)=>{
    res.render("listings/new.ejs");}

module.exports.showListing = async (req,res)=>{
    let id = req.params.id;
    let listing = await Listing.findById(id).populate({
    path: "review",
    populate: {
      path: "author"
    }
  }).populate("owner");
    if(!listing){
        req.flash("error","listing you are requested for does not exist!!");
        res.redirect("/listings");
    }else{
    res.render("listings/show.ejs",{listing});}
}

module.exports.createNewListing = async(req,res,next)=>{
        let path = req.file.path;
        let filename = req.file.filename;
        let newlisting = req.body.listing;
        newlisting.image = {path,filename}
        let listed = new Listing({
        title: newlisting.title,
        description: newlisting.description,
        price: newlisting.price,
        location: newlisting.location,
        country: newlisting.country,
        image: newlisting.image});
        listed.owner = req.user._id;
       await listed.save();
       req.flash("success","Listing is saved");
       res.redirect("/listings");

}

module.exports.editListingForm = async (req,res)=>{
    let id = req.params.id;
    let listing = await Listing.findById(id);
     if(!listing){
        req.flash("error","listing you are requested to edit does not exist!!");
        res.redirect("/listings");
    }else{
    let originalImgUrl = listing.image.path;
    originalImgUrl = originalImgUrl.replace("/upload","/upload/w_250")
    
    req.flash("success","Listing is edited successfully!");
    res.render("listings/edit.ejs",{listing , originalImgUrl})}
}

module.exports.updateEditInfo = async (req,res)=>{
    let id = req.params.id;
    let editlisting = req.body;
    let editedlisting = await Listing.findByIdAndUpdate(id,editlisting);
    if(typeof(req.file) != "undefined"){
            let path = req.file.path;
            let filename = req.file.filename;
            editedlisting.image = {path,filename};
            await editedlisting.save();
    }
    res.redirect("/listings");
}

module.exports.destroyListing = async (req,res)=>{
    let id = req.params.id;
    let deletelisting = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing is deleted");
    res.redirect("/listings");
}