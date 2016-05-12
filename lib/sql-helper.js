/* 
    Simple helper class for running queries
    NOTE: this uses promises!
*/

var sql = require("mssql");

var connectionString = "Server=tcp:team1parkland.database.windows.net,1433;Database=team1parkland;Uid=cfleming12@team1parkland;Pwd=Sgtcf11c!;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=3000;";

exports.query = function(sqlString){
  
  return sql.connect(connectionString).then(function () {

        return new sql.Request().query(sqlString);

    });
    
};