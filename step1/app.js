var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();

//var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database(".data/nutrition.db");

var filePath = "./datasets/*";
var jdata = fs.readFileSync(filePath);
var data = JSON.parse(jdata);
// get id for a single episode
//console.log(data._embedded.episodes[0].id);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
// basic logging
app.use(function(req, res, next){
    var log = "Request URL: " + req.url;
    console.log(log);
    next();
});

app.get("/api/search", require(".routes/api"));
app.get("/api/list", require(".routes/api"));


app.get("/nutrition", function(req, res){
       res.render("index", { 
       Name: "Ingredient"
    }); 
});

app.get("/nutrition/:id", function(req, res){
   var id = req.params.id;
   var page = req.query.page; 
   res.send("something here"); 
   res.render("detail.html")
});

// handle 404 errors for URLs that dont exist
app.use(function(req, res, next){
   var err = new Error("Page Not Found!");
   err.status = 404;
   next(err); 
});

// handle any and all errors
app.use(function(err, req, res, next){
   res.status(err.status || 500);
   res.send(err.message);
});

app.listen(process.env.PORT || 3000, function(){
    console.log('Example app listening on port 3000');
});