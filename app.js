const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));

//Local Database Link
const uri = "mongodb://localhost:27017/wikiDB";
//Local Database having articles schema
const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
});
const Articles = mongoose.model("Articles", articleSchema);

//connecting to mongodb
mongoose
    .connect(uri)
    //Checking whether connect or not
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}!`);
        });
    })
    //CAtching error if not connected with database connection
    .catch((error) => {
        console.log(`Error: ${error}`);
    });

//Reading from database
app.get("/articles", (req, res) => {
    Articles.find({})
        .then((articles) => {
            console.log(articles);
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        });
});

//POST a new article to database
app.post("/articles", (req, res) => {
    const newArticle = new Articles({
        title: req.body.title,
        content: req.body.content,
    });
    newArticle
        .save()
        .then(() => {
            console.log("Article added successfully");
            res.send("Article added successfully");
        })
        .catch((err) => {
            console.log(`Error: ${error}`);
            res.send("Error adding article");
        });
});

//Delete all articles from database
app.delete("/articles", (req, res) => {
    Articles.deleteMany({})
        .then(() => {
            console.log("All articles deleted successfully");
            res.send("All articles deleted successfully");
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
            res.send("Error deleting all articles");
        });
});