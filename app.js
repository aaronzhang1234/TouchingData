const express = require("express");
const http = require("http");
const path = require("path");
const WS_Controller = require("./app/web-scraping/src/webscraper_controller")
var app = express();

app.use(express.static(__dirname + '/dist/dashboard'));

app.get("/*", function(req, res){
    res.sendfile(path.join(__dirname));
});

app.get("/scrapeSites", function(req, res){
    let webscraper = new WS_Controller();
    webscraper.webscrapeAllSites();
});

app.get("/getWebsites", function(req, res){
    let webscraper = new WS_Controller();
    webscraper.getBingResults();
});
app.get("/downloadMedia", function(req, res){
    let webscraper = new WS_Controller();
    webscraper.downloadAllMedia();
});

const server = http.createServer(app);

server.listen(3000, ()=>console.log("Server is now running at http://localhost:3000"));