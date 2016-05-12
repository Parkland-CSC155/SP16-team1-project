var http = require("http");
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sql = require('mssql');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');
var session = require('express-session');

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
//app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(session({ 
  resave: false, 
  saveUninitialized: true,
  secret: 'qeurhqjajdfhy23249hhfsaff==' 
}));

app.use(passport.initialize());
app.use(passport.session());

var connectionString = "Server=tcp:team1parkland.database.windows.net,1433;Database=team1parkland;Uid=cfleming12@team1parkland;Pwd=Sgtcf11c!;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=3000;";

// index page goes to list
app.get("/", function (req, res) {
    res.redirect('/list');
});

// list page
app.get("/list", function (req, res) {
    if (req.session.loggedin){
    sql.connect(connectionString).then(function () {
        var page = req.query.page || 1;
            page = Number(page);
            var skip = (page - 1) * 25;
        new sql.Request().query(`
SELECT  *
FROM    NutritionData
ORDER BY Shrt_Desc
OFFSET  ${skip} ROWS
FETCH NEXT 25 ROWS ONLY
`).then(function (recordset) {
            res.render("index", {
                Name: "Ingredient",
                infos: recordset,
                page: page
            });
        });
    }).catch(function (err) {
        console.error(err);
        // ... query error checks
    });
    return;
}
    res.render('login');

});


// list page with searchText
app.get("/list/:searchText", function (req, res) {
    if (req.session.loggedin){
    sql.connect(connectionString).then(function () {
        var searchText = req.params.searchText;
        var page = req.query.page || 1;
            page = Number(page);
            var skip = (page - 1) * 25;
        new sql.Request().query(`
SELECT  *
FROM    NutritionData
WHERE   Shrt_Desc LIKE '${searchText}%'
ORDER BY Shrt_Desc
OFFSET  ${skip} ROWS
FETCH NEXT 25 ROWS ONLY
`).then(function (recordset) {
            res.render("index_search", {
                Name: "Ingredient",
                infos: recordset,
                page: page,
                searchText: searchText
            });
        });
    }).catch(function (err) {
        console.error(err);
        // ... query error checks
    });
        return;
}
    res.render('login');
});

// search by id
app.get("/details/:id", function (req, res) {
    if (req.session.loggedin){
    sql.connect(connectionString).then(function () {
        var page = req.query.page || 1;
        page = Number(page);
        var skip = (page - 1) * 25;
        var id = req.params.id || 0;
        new sql.Request().query(`
SELECT  *
FROM    NutritionData
WHERE   NDB_No = '${id}'
ORDER BY Shrt_Desc
OFFSET  ${skip} ROWS
FETCH NEXT 25 ROWS ONLY
`).then(function (recordset) {
            res.render("index", {
                Name: "Ingredient",
                infos: recordset,
                page: page
            });
        });
    }).catch(function (err) {
        console.error(err);
        // ... query error checks
    });
    return;
}
    res.render('login');
});



// login/logout
app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.loggedin = true;
    res.redirect('/profile');
  });
  
app.get('/logout',
  function(req, res){
    req.session.loggedin = false;
    req.logout();
    res.redirect('/login');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

app.get("/api/example", function(req, res){
   
   res.json([
       { "Nut_No": 1, Fat: "30g"}
   ]);
    
});


// api pages

// apikey
const APIKEY = 'SP16Team1';

app.get("/api/list", function (req, res) {
    var reqApiKey = req.query.apiKey

   if(!reqApiKey){
        res.status(401);
        res.send("Missing API Key");
        return;   
   } 

   if(reqApiKey !== APIKEY){
        res.status(401);
        res.send("Invalid API Key");
        return; 
   }
    
    sql.connect(connectionString).then(function () {
    
    var page = req.query.page || 1

    var skip = (page - 1) * 25;

    var qry = `
SELECT  *
FROM    NutritionData
ORDER BY Shrt_Desc
OFFSET  ${skip} ROWS
FETCH NEXT 25 ROWS ONLY    
    `;

    // do the query 
    
    return new sql.Request().query(qry).then(function(recordset) {
            console.log(recordset);
            
            res.json(recordset);
        });

    })
    .catch(function(err){
      console.error(err);
      next(err);

});
});


app.get("/api/search/:searchText", function (req, res) {
    var reqApiKey = req.query.apiKey

   if(!reqApiKey){
        res.status(401);
        res.send("Missing API Key");
        return;   
   } 

   if(reqApiKey !== APIKEY){
        res.status(401);
        res.send("Invalid API Key");
        return; 
   }
    
    sql.connect(connectionString).then(function () {
    
    var page = req.query.page || 1
        var searchText = req.params.searchText;

        var skip = (page - 1) * 25;

        var qry = `
SELECT  *
FROM    NutritionData
WHERE   Shrt_Desc LIKE '${searchText}%'
ORDER BY Shrt_Desc
OFFSET  ${skip} ROWS
FETCH NEXT 25 ROWS ONLY    
    `;

        // do the query 

        return new sql.Request().query(qry).then(function (recordset) {
            console.log(recordset);

            res.json(recordset);
        });

    })
        .catch(function (err) {
            console.error(err);
            next(err);
        });
});


// api by id
app.get("/api/:id", function(req, res){

   // REQUEST: www.blah.com/api?apiKey=abcd
   var reqApiKey = req.query.apiKey

   if(!reqApiKey){
        res.status(401);
        res.send("Missing API Key");
        return;   
   } 

   if(reqApiKey !== APIKEY){
        res.status(401);
        res.send("Invalid API Key");
        return; 
   }
   
   var id = req.params.id || "0";
   
    sql.connect(connectionString).then(function () {

        var qry = `
SELECT  TOP 1 *
FROM    NutritionData
WHERE   NDB_No = '${id}'
`;

        return new sql.Request().query(qry).then(function(recordset) {
            console.log(recordset);
            
            var record = recordset[0];
            
            res.json(record);
        });

    })
    .catch(function(err){
      console.error(err);
      next(err);  
    });

});



// Calculator
app.get("/calculator", function(req, res) {
    if (req.session.loggedin){
    req.session.chosenIngredients = [];
    res.render("calculator" ,{
            infos: req.session.chosenIngredients
    });
    return;
     }
     res.render('login');
    
});


app.get("/calculator/form", function(req, res, next){
  res.render("form",{
                infos: [],
                page: 1,
                searchText: ''
            });
});

app.post("/calculator/form", function(req, res, next){
    if (req.session.loggedin){
    var searchText = req.body.nameInput;
    var ingreidient = req.body.ingreidient;
    var servingSize = req.body.servingSize;
  
    sql.connect(connectionString).then(function () {
        var page = req.query.page || 1;
            page = Number(page);
            var skip = (page - 1) * 25;
        new sql.Request().query(`
SELECT  *
FROM    NutritionData
WHERE   Shrt_Desc LIKE '${searchText}%'
ORDER BY Shrt_Desc
OFFSET  ${skip} ROWS
FETCH NEXT 25 ROWS ONLY
`).then(function (recordset) {
            res.render("form", {
                infos: recordset,
                page: page,
                searchText: searchText
            });
        });
    }).catch(function (err) {
        console.error(err);
        // ... query error checks
    });  
    return;
     }
     res.render('login');
});

app.post("/calculator", function(req, res, next){
    
  var ingredient = req.body.ingredient;
  var servingSize = req.body.servingSize;
  
    sql.connect(connectionString).then(function () {
        new sql.Request().query(`
SELECT  *
FROM    NutritionData
WHERE   Shrt_Desc LIKE '${ingredient}%'
ORDER BY Shrt_Desc
`).then(function (recordset) {
            req.session.chosenIngredients.push([recordset[0], servingSize]);
            res.render("calculator" ,{
            infos: req.session.chosenIngredients
    });
            
        });
    }).catch(function (err) {
        console.error(err);
        // ... query error checks
    });  
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
} else {

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}


var port = process.env.PORT || 3000
var server = http.createServer(app);
server.listen(port, function(){
   console.log("app listening on port: " + port);  
});