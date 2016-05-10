

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
