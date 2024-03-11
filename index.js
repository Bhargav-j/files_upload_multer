const express = require("express");
const multer = require("multer")
const mongoose = require('mongoose')
const temp = require("./models/sample")
const path = require('path')

const app = express();
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("home")
})


mongoose.connect("mongodb+srv://jeereddybhargaviith:jeereddybhargaviith@cluster0.zlrzrb9.mongodb.net/").then(
    () => {
        console.log("Connected to DataBase")
    }
).catch((err) => {console.log(err)})


const storage = multer.diskStorage({
    destination : "./uploads/",
    filename : function(req, file, cb){
        cb(null, file.originalname.split(".")[0] + "-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage : storage})


app.post("/", upload.fields([{name : 'image1', maxCount: 1}, {name : 'image2', maxCount: 1}]) ,async (req, res) => {

    const {ImageName} = req.body

    // console.log(req.files)

    const img1 = req.files['image1'][0].path
    const img2 = req.files['image2'][0].path

    const sample = await temp.create({Title : ImageName, image1 : img1, image2 : img2})

    res.redirect(`/display?title=${ImageName}&image1Path=${img1}&image2Path=${img2}`)

    // res.json({ message: "Data saved successfully", sample });
})

// app.post("/", upload.single("image") ,async (req, res) => {

//     const {ImageName} = req.body

//     const sample = await temp.create({Title : ImageName, image : req.file.path})

//     res.redirect(`/display?title=${ImageName}&imagePath=${req.file.path}`)

//     // res.json({ message: "Data saved successfully", sample });
// })


app.get("/display", (req, res) => {

    const {title, image1Path, image2Path} = req.query

    res.render("display", {title, image1Path, image2Path})
})


const port = 3000 || process.env.PORT;

app.listen(port, () => {
    console.log("listening to server")
})
