const express = require("express");
const http = require("http");
const path = require("path");
const WS_Controller = require("./app/web-scraping/src/webscraper_controller");
const DataMigrator = require("./app/dataMigration/src/DataMigrator.js");
const DbBuilder = require("./app/dataMigration/src/DbBuilder.js");
const bodyparser = require("body-parser");
const socketIo = require('socket.io');
const EM = require('./app/web-scraping/src/emitter.js');

var app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(express.static(__dirname + "/dist/dashboard"));

app.get("/*", function(req, res) {
  res.sendfile(path.join(__dirname));
});

app.post("/buildDb", function(req, res) {
  console.log(req.body);
  let dbBuilder = new DbBuilder();
  dbBuilder.buildDb();
  res.send({ status: "Database Built!" });
});

app.post("/import", function(req, res) {
	console.log(req.body);

	let dataMigrator = new DataMigrator();
	dataMigrator.migrateData()	

	console.log("migration starting")
	res.send({ status : "Data is Migrating" });
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
const io = socketIo(server);

io.on('connection', (socket)=>{
  EM.on('webscraper', function(position, total_position, website, media){
    socket.emit('webscraper',{
      position:position,
      total_position:total_position,
      website:website,
      media:media
    })
  })
});
