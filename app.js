const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const assert = require("assert");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const ArticleSchema = mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", ArticleSchema);

app.route("/articles")
    .get((req, res) => {
        Article.find({}, (err, response) => {
            assert.equal(err, null);
            res.send(response);
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function (err) {
            assert.equal(err, null);
            res.send("Successfully added a new article.");
        });
    })
    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            assert.equal(err, null);
            res.send("Succesfully deleted all the articles");
        });
    });

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle}, (err, response) => {
            if (response) {
                res.send(response);
            }else{
                res.send("Sorry no articles matching that title was found.")
            }
        });
    })
    .put((req, res) => {
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title},
            {overwrite: true},
            function (err) {
               if (!err) {
                   res.send("Successfully updated");
               } 
            }
        );
    })

    .patch((req, res)=> {
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            (err) => {
                if (!err) {
                    res.send("Succesfully Updated Article");
                }else{
                    res.send(err);
                }
            }
        )
    })

    .delete((req, res) => {
        Article.deleteOne({title: req.params.articleTitle}, (err) => {
            if (!err) {
                res.send("Successfully deleted!");
            }else{
                res.send(err);
            }
        });
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});