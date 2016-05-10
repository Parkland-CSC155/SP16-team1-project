var express = require("express");
var path = require("path");
var fs = require("fs");
//var sql = require("mssql");
//var connectionString = process.env.MS_TableConnectionString; //my db credentials

var app = express();

var sql = require('mssql');

sql.connect("Server=tcp:team1parkland.database.windows.net,1433;Database=team1parkland;Uid=cfleming12@team1parkland;Pwd=Sgtcf11c!;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=3000;").then(function() {
    new sql.Request().query('select top 25 * from NutritionData').then(function(recordset) {
    console.dir(recordset);
    IngredientWrapper(recordset);
});
}).catch(function(err) {
    console.error(err);
    // ... query error checks 
});

// var filePath = "./datasets/*";

// var jdata = fs.readFileSync(filePath);
// var data = JSON.parse(jdata);
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



//app.use("/api", require("./routes/api"));
app.get("/api/search", require("./routes/api"));
app.get("/api/list", require("./routes/api"));

// app.get("/api/search", require("./routes/api"));

// SQL part
// new sql.Request().query('select top 25 * from NutritionData').then(function(recordset) {
//     console.dir(recordset);
// }).catch(function(err) {
//     // ... query error checks 
// });

// Stored Procedure

// new sql.Request()
// .input('input_parameter', sql.Int, value)
// .output('output_parameter', sql.VarChar(50))
// .execute('procedure_name').then(function(recordsets) {
//     console.dir(recordsets);
// }).catch(function(err) {
//     // ... execute error checks 
// });

// // ES6 Tagged template literals (experimental) 

// sql.query`select * from mytable where id = ${value}`.then(function(recordset) {
//     console.dir(recordset);
// }).catch(function(err) {
//     // ... query error checks 
// });

// webpage part
var IngredientWrapper = function (recordset){app.get("/", function(req, res) {
    res.render("index", {
        Name: "Ingredient",
        infos: recordset
    });
})
};
// example!!!!!!!!!!
// res.render('list', {
//    rows: nutritionrecords
//});

app.get("/calculator", function(req, res){
       res.render("calculator") 
});

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