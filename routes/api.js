var express = require("express");
var router = express.Router();
var sql = require("mssql");

// an example helper you can use!
var sqlHelper = require('../lib/sql-helper');
var connectionString = "Server=tcp:team1parkland.database.windows.net,1433;Database=team1parkland;Uid=cfleming12@team1parkland;Pwd=Sgtcf11c!;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=3000;"


// api/search/{searchText}?page=3
router.get("/search/:searchText", function (req, res, next) {
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



// search by id
router.get("/:id", function (req, res, next) {

    var id = req.params.id || "0";

    //var connectionString = "Server=tcp:team1parkland.database.windows.net,1433;Database=team1parkland;Uid=cfleming12@team1parkland;Pwd=Sgtcf11c!;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=3000;"

    sql.connect(connectionString).then(function () {

        var qry = `
SELECT  TOP 1 *
FROM    NutritionData
WHERE   NDB_No = '${id}'
`;

        return new sql.Request().query(qry).then(function (recordset) {
            console.log(recordset);

            var record = recordset[0];

            res.json(record);
        });

    })
        .catch(function (err) {
            console.error(err);
            next(err);
        });

});


router.get("/", function (req, res, next) {
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

module.exports = router;