const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initdata = require("./data.js");
const dns = require("dns");
dns.setServers(["1.1.1.1"],["0.0.0.0"])
main()
.then(()=>{console.log("connected to db")})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect("MONGO_URL");
}

const initDB = async ()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((e)=>({
      ...e,owner:'69baa7b52909b8ed91f57641'
    }))
    await Listing.insertMany(initdata.data);
    console.log("data was saved");
}
initDB();