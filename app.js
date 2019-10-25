const express = require("express");
const http = require("http");
const path = require("path");
const WS_Controller = require("./app/web-scraping/src/webscraper_controller")
var app = express();

app.use(express.static(__dirname + '/dist/dashboard'));

app.get("/*", function(req, res){
    res.sendfile(path.join(__dirname));
});

app.get("/whelp", function(req, res){
    let webscraper = new WS_Controller();
    webscraper.webscrapeAllSites();
});

const server = http.createServer(app);

server.listen(3000, ()=>console.log("fug"));