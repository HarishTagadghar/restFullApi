//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true })

const articleSchema = {
    title: String,
    discription:String
};

const Article = mongoose.model("Article", articleSchema);


app.route("/articles").get(function(req,res){
    Article.find({},function(err,foundArticles){
    if(!err){
        res.send(foundArticles);
    } else{
        res.send(err);
    }
    
    });
    
    }) 
    
    .post(function(req,res){
        const newArticle = new Article({
            title: req.body.title,
            discription: req.body.discription
        });
    
        newArticle.save(function(err){
            if (!err){
                res.send("item added successfully with postman app");
            }else{
                res.send(err);
            }
        });
    
    }) 
    
    .delete(function(req,res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("succefully deleted all files");
            }else{
                res.send(err);
            }
        });
    }) ;



    app.route("/articles/:userTitle")
    .get(function(req,res){
        Article.findOne({title:req.params.userTitle},function(err,foundArticle){
            if(foundArticle){
                res.send(foundArticle);
            }else{
                res.send("cannot get/articles/"+req.params.userTitle);
            }
        });
    })
    .put(function(req,res){
        Article.update(
            {title:req.params.userTitle},
            {title: req.body.title, discription: req.body.discription},
            {overwrite:true},
            function(err){
                if (!err) {
                    res.send("successfully updated with put function");
                }
            }
        );
    });



app.listen(3000, function() {
  console.log("Server started on port 3000");
})