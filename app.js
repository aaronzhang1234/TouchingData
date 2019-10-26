const express = require("express");
const http = require("http");
const path = require("path");
const WS_Controller = require("./app/web-scraping/src/webscraper_controller")
const DataMigrator = require("./app/dataMigration/src/DataMigrator.js")
const bodyparser = require('body-parser');

var app = express();

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.use(express.static(__dirname + '/dist/dashboard'));

app.get("/*", function(req, res){
    res.sendfile(path.join(__dirname));
});

app.get("/whelp", function(req, res){
    let webscraper = new WS_Controller();
    webscraper.webscrapeAllSites();
});

app.post("/import", function(req,res){
	console.log(req.body)
	let dataMigrator = new DataMigrator();
	dataMigrator.migrateData();
	res.send({status : "success"});
})

const server = http.createServer(app);

server.listen(3000, ()=>console.log("fug"));
