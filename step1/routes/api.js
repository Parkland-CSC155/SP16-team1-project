var express = require("express");
var router = express.Router();

router.get("/search", function(req, res){
    res.send("Hello World");
});

router.get("/list", function(req, res){
    res.json()
});

//     var skip = (page - 1) * 25;

//     var sql = `
// SELECT    *
// FROM      NutritionData
// WHERE     Shrt_Desc LIKE '${searchText}'
// LIMIT     25 OFFSET ${skip}
// `;

// // do the query
// db.all(sql, function(err, records){
//     if(err){
//         console.error(err);
//         return;
//     }
//     res.json(records);
// })


module.exports = router;
