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

// Get a specific Article
app
    .route("/articles/:articleTitle")
    .get((req, res) => {
        Articles.findOne({ title: req.params.articleTitle })
            .then((article) => {
                console.log(
                    `Article with id : ${req.params.article} gets successfully`
                );
                console.log(article);
                res.send(article);
            })
            .catch((err) => {
                console.log(err);
            });
    })

.delete((req, res) => {
    Articles.deleteOne({ title: req.params.articleTitle })
        .then(() => {
            console.log(
                `Article with title : ${req.body.title} deleted successfully`
            );
            res.send("Article deleted successfully");
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
})

.put((req, res) => {
        //req.params.:(id,name, etc) uses for getting the id update and delete or read it
        Articles.updateOne({ title: req.params.articleTitle },
                //req.body.(id,name, object_name etc) is used to update the  new values
                { title: req.body.title, content: req.body.content }, { overwrite: true }
            )
            .then((article) => {
                console.log(
                    `Article with title : ${req.params.article} updated successfully`
                );
                console.log(article);
                res.send(article);
            })
            .catch((err) => {
                console.log(err);
            });
    })
    .patch((req, res) => {
        Articles.updateOne({ title: req.params.articleTitle },
                // Syntax is         {$set: { value1:, value2:,}}
                // { $set: { title: } }
                // OR
                //this allows the user to change in the fields which he wants
                { $set: req.body }
            )
            .then((article) => {
                console.log(
                    `Article with title : ${req.body.title} updated successfully`
                );
                res.send(article);
            })
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
    });

//Routing Method
// app.route("/articles")     // for routing the path
// .get()
// .delete()
// .post