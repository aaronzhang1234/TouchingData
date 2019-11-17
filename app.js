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

app.get("/convertTextToAudio", function(req, res){
    let webscraper = new WS_Controller();
    webscraper.convertAllTextToAudio();
})

app.get("/cancelJob", function(req, res){
  process.exit(2);
})

const server = http.createServer(app);

server.listen(3000, ()=>console.log("Server is now running at http://localhost:3000"));
const io = socketIo(server);

io.on('connection', (socket)=>{
  EM.removeAllListeners();
  EM.on('websiteUrl', function(websiteUrl){
    socket.emit('websiteUrl',{
      arg1:websiteUrl
    })
  })
  EM.on('downloadMediaStatus', function(media){
    socket.emit('downloadMediaStatus', {
      arg1:media
    })
  })
  EM.on('website', function(webiste){
    socket.emit('website',{
      arg1:webiste
    })
  })
  EM.on('textToAudioStatus', function(text){
    socket.emit('textToAudioStatus', {
      arg1:text
    })
  })
  setInterval(function(){
    socket.emit('hello',{
      arg1:"fuck"
    })
  }, 2000);
});
