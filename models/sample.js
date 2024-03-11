const mongoose = require("mongoose")


const Temp = new mongoose.Schema({
    Title : String,
    image1 : String,
    image2 : String,
})


module.exports = mongoose.models.temp || mongoose.model('temp', Temp)