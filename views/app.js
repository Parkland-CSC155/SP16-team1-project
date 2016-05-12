
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Index</title>
</head>
    <body>
        <h1>Nutriton Infomation</h1>
        <hr>
        <table style="width:100%">
        <% for(var i=0; i<25; i++) {%>
            <tr>
                <td><%= infos[i]['Shrt_Desc'] %></td>
                <td><%= infos[i]['Energ_Kcal'] %></td>
                <td><%= infos[i]['Carbohydrt_(g)'] %></td>
                <td><%= infos[i]['Lipid_Tot(g)'] %></td>
                <td><%= infos[i]['Protein_(g)'] %></td>
                <td><%= infos[i]['Sodium_(mg)'] %></td>
                <td><%= infos[i]['Sugar_Tot_(g)'] %></td>
                <% } %>
            </tr>
        </table>
    </body>
</html>

var http_port = 3000;
var http = require("http");
var htutil =require("./htutil");
 
var server = http.createServer(function(req,res)
                {
                    htutil.loadParams(req,res,undefined);
                    if (req.params.pathname==="/")
                    {
                        require("./home-node").get(req,res);
                    }
                    else if (req.params.pathname==="/Shrt_Desc")
                    {
                        require("./Shrt_Desc-node").get(req,res);
                    }
                    else if (req.params.pathname === "/Energ_Kcal")
                    {
                        require("./Energ_Kcal-node").get(req,res);
                    }
                    else if (req.params.pathname === "/Carbohydrt_(g)")
                    {
                        require("./fibo-node").get(req,res);
                    }
                    else if (req.params.pathname === "/Lipid_Tot(g)")
                    {
                        require("./Lipid_Tot(g)-node").get(req,res);
                    }
                    else  if (req.params.pathname === "/Protein_(g)")
                    {
                        require("./Protein_(g)(g)-node").get(req,res);
                    }
                    else if (req.params.pathname === "/Sodium_(mg)")
                    {
                        require("./Sodium_(mg)-node").get(req,res);
                    }
                    else if (req.params.pathname === "/Sugar_Tot_(g)")
                    {
                        require("./Sugar_Tot_(g)-node").get(req,res);
                    }
                    else
                    {                    {
                        res.writeHead(404,{"Content-Type":"text/plain"});
                        res.end("bad URL " + req.url);
                    }
                });
server.listen(http_port);
console.log("listening to http://localhost:3000");

var url = require("url");
exports.loadParams = function(req,res,next)
{
    req.params = url.parse(req.url,true);
    req.a = (req.params.query.a && !isNaN(req.params.query.a)) ? new Number (req.params.query.a) : NaN ;
    req.b = (req.params.query.b && !isNaN(req.params.query.b)) ? new Number (req.params.query.b) : NaN ;
    if (next) next();
}
exports.navbar = function()
{
    return ["<div class="navbar">",
            "<p><a href="/">home</a></p>",
            "<p><a href="/Shrt_Desc">Description</a></p>",
            "<p><a href="/Energ_Kcal">Energy</a></p>",
            "<p><a href="/Carbohydrt_(g)">Carbohydrates</a></p>",
            "<p><a href="/Lipid_Tot(g)">Lipid Total</a></p>",
            "<p><a href="/Protein_(g)">Protein</a></p>",
            "<p><a href="/Sodium_(mg)">Sodium</a></p>",
            "<p><a href="/Sugar_Tot_(g)">Sugar Total</a></p>",
            "</div>"].join("\n");
}
exports.page= function (title, navbar, content)
{
    return ["<html><head><title>{title}</title></head>",
            "<body><h1>{title}</h1>",
            "<table><tr>",
            "<td>{navbar}</td><td>{content}</td>",
            "</tr></table></body></html>"
            ].join("\n2")
            .replace(/{title}/g,title)
            .replace(/{navbar}/g,navbar)
            .replace(/{content}/g,content);
}


var Energ_Kcal = exports.Energ_Kcal = function(n)
{
    if (n==0)
        return 1;
    else
        return n * Energ_Kcal (n-1);
}

var Carbohydrt_(g) = exports.Carbohydrt_(g) = function(n)
{
    if (n==0)
        return 1;
    else
        return n * Carbohydrt_(g) (n-1);
}

var Lipid_Tot(g) = exports.Lipid_Tot(g) = function(n)
{
    if (n==0)
        return 1;
    else
        return n * Lipid_Tot(g) (n-1);
}

var Protein_(g) = exports.Protein_(g) = function(n)
{
    if (n==0)
        return 1;
    else
        return n * Protein_(g) (n-1);
}
 
var Sodium_(mg) = exports.Sodium_(mg) = function(n)
{
    if (n==0)
        return 1;
    else
        return n * Sodium_(mg) (n-1);
}
 
var Sugar_Tot_(g) = exports.Sugar_Tot_(g) = function(n)
{
    if (n==0)
        return 1;
    else
        return n * Sugar_Tot_(g) (n-1);
}
