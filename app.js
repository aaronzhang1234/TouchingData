const express = require("express");
const http = require("http");
const path = require("path");
const WS_Controller = require("./app/web-scraping/src/webscraper_controller");
const DataMigrator = require("./app/dataMigration/src/DataMigrator.js");
const DbBuilder = require("./app/dataMigration/src/DbBuilder.js");
const bodyparser = require("body-parser");
const socketIo = require('socket.io');
const EM = require('./app/emitter.js');
var multer = require('multer');

var app = express();
var files = []
var migrating = 0;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use(express.static(__dirname + "/dist/dashboard"),
);


app.use(function(req, res, next) { //allow cross origin requests
	res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Credentials", true);
	next();
});

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
	let dataMigrator = new DataMigrator();
	if (files.length > 0){
		migrating = files.length;
		for (let i = migrating; i > 0; i--){
			console.log(files[0].path)
			dataMigrator.migrateData(files[0].path)	
			files.shift();
		}
	}else {
		console.log("ye olde originale")
		dataMigrator.migrateData()	
	}

	console.log("migration starting")
	res.send({ status : "Migrating" });
});

app.get("/scrapeSites", function(req, res){
    let webscraper = new WS_Controller();
    webscraper.webscrapeAllSites();
		res.send();
});

app.get("/getWebsites", function(req, res){
    let webscraper = new WS_Controller();
    webscraper.getBingResults();
		res.send();
});

app.get("/downloadMedia", function(req, res){
    let webscraper = new WS_Controller();
    webscraper.downloadAllMedia();
		res.send();
});

app.get("/convertTextToAudio", function(req, res){
    let webscraper = new WS_Controller();
    webscraper.convertAllTextToAudio();
		res.send();
})
app.post("/cancelJob", function(req, res){
	EM.emit("kill", req.body)
	//process.kill(process.pid);
  console.log(req.body);
	res.send({status:"killed"})
})


const server = http.createServer(app);

const io = socketIo(server);

io.on('connection', (socket)=>{

	EM.removeAllListeners();
	EM.on('website', function(webiste){
		socket.emit('website',{
			arg1:webiste
		})
	})
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
  EM.on('textToAudioStatus', function(text){
    socket.emit('textToAudioStatus', {
      arg1:text
    })
  })
	EM.on('migrate', function(data){
		migrating--;
		if (migrating < 1){
			socket.emit('migrate',data);
		}
	})
	setInterval(function(){
		socket.emit('hello',{
			arg1:"fug"
		})
	}, 2000);
});

var storage = multer.diskStorage({ //multers disk storage settings
	destination: function (req, file, cb) {
		cb(null, './data/sheets');
	},
	filename: function (req, file, cb) {
		var datetimestamp = Date.now();
		cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
	}
});

var upload = multer({ //multer settings
	storage: storage
}).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
	upload(req,res,function(err){
		console.log(req.file);
		files.push(req.file)
		if(err){
			res.json({error_code:1,err_desc:err});
			return;
		}
		res.json({error_code:0,err_desc:null});
	});
});

server.listen(3000, ()=>console.log("Server will run at http://localhost:3000"));
