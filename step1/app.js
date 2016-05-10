var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();

var sql = require('mssql');

var recordset;

var connectString = "Server=tcp:team1parkland.database.windows.net,1433;Database=team1parkland;Uid=cfleming12@team1parkland;Pwd=Sgtcf11c!;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=3000;"

var routes = require('./routes')

app.get("/list", function(req, res) {
    sql.connect(connectString).then(function() {
        new sql.Request().query('select top 25 * from NutritionData').then(function(recordset) {
            res.render("index", {
                Name: "Ingredient",
                infos: recordset
            });
        });
    }).catch(function(err) {
    console.error(err);
    // ... query error checks
});
});

app.get("/list?page={pageNumber}", function(req, res) {
    sql.connect(connectString).then(function() {
        new sql.Request().query('select top 25 * from NutritionData').then(function(recordset) {
            res.render("index", {
                Name: "Ingredient",
                infos: recordset
            });
        });
    }).catch(function(err) {
    console.error(err);
    // ... query error checks
});
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
// basic logging
app.use(function(req, res, next) {
    var log = "Request URL: " + req.url;
    console.log(log);
    next();
});



//app.use("/api", require("./routes/api"));
//app.get("/api/search", require("./routes/api"));
app.get("/list", require("./routes/api"));

// This work
app.get("/api/index", routes.index);

// webpage part
// var IngredientWrapper = function (recordset){app.get("/", function(req, res) {
//     res.render("index", {
//         Name: "Ingredient",
//         infos: recordset
//     });
// });
// };

// app.get("/", function(req, res) {
//     res.render("index", {
//         Name: "Ingredient",
//         infos: recordset
//     });
// });

app.get("/calculator", function(req, res) {
    res.render("calculator")
});

app.get("/nutrition", function(req, res) {
    res.render("index", {
        Name: "Ingredient"
    });
});

app.get("/nutrition/:id", function(req, res) {
    var id = req.params.id;
    var page = req.query.page;
    res.send("something here");
    res.render("detail.html")
});

// handle 404 errors for URLs that dont exist
app.use(function(req, res, next) {
    var err = new Error("Page Not Found!");
    err.status = 404;
    next(err);
});

// handle any and all errors
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

app.listen(process.env.PORT || 3000, function() {
    console.log('Example app listening on port 3000');
});