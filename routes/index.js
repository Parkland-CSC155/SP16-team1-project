// const APIKEY = 'team1SP16'; // some unique value that attackers cannot guess

// // validate all requests to the /api -based routes
// app.use(function(req, res, next){

//    if(req.baseUrl !== "/api"){
//        next();
//        return;
//    }

//    // REQUEST: www.blah.com/api?apiKey=abcd
//    var reqApiKey = req.query.apiKey

//    if(!reqApiKey){
//         res.status(401);
//         res.send("Missing API Key");
//         return;   
//    } 

//    if(reqApiKey !== APIKEY){
//         res.status(401);
//         res.send("Invalid API Key");
//         return; 
//    }

//    // all good at this point, so let the request move on through the pipeline
//    next();
// });

exports.index = function(req, res){
    var page = req.query.page || 1    
    var skip = (page - 1) * 25;

    var sql = `
SELECT    *
FROM      NutritionData
LIMIT     25 OFFSET ${skip}
`;

//do the query
db.all(sql, function(err, records){
    if(err){
        console.error(err);
        return;
    }
    
    res.json(records);
})
//res.send("Sometext")
}


// /search/:searchText
exports.search = function(req, res){
    var page = req.query.page || 1
    var searchText = req.params.searchText;
    
    var skip = (page - 1) * 25;

    var sql = `
SELECT    *
FROM      NutritionData
WHERE     Shrt_Desc LIKE '${searchText}'
LIMIT     25 OFFSET ${skip}
`;

// do the query
db.all(sql, function(err, records){
    if(err){
        console.error(err);
        return;
    }
    records.forEach(function(row){
       nutritionList.push(row['Shrt_Desc']);
       // ... 
    });
    
    res.json(records);
})
};
