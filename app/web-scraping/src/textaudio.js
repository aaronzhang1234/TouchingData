/* ****************** TEXTAUDIO.JS ******************
 * 2019 November 11 : Hadi Haidar : Created
 ********************************************
 * Purpose : File that runs saves files as text to audio *
 */
// const webscraperjs = require('./webscraper.js');
// const DAO = require("../../DAO.js");
// let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";

// this.webscraper = new webscraperjs("458f7fc0ea5c44d38e45178c62515c7b");
// this.dao = new DAO(sqlDatabaseName);
// this.webscraper.convertTextToAudio('XEROX_CORPORATION/', 'data/abouts/XEROX_CORPORATION/1.txt',8, 310);


const WS_Controller = require("./webscraper_controller.js");
let EM = require("./emitter.js");
const fs = require("fs");

let webscraper_controller = new WS_Controller();

//webscraper_controller.getBingResults();
//webscraper_controller.downloadAllMedia();
//webscraper_controller.webscrapeAllSites();
webscraper_controller.convertAllTextToAudio();








// const say = require('say');
// var fs = require('fs'),
//     path = require('path');

// var filepath = path.join(__dirname, 'test.txt');

// fs.readFile("test.txt", "utf-8", function(err, data){
//     if(err) throw err;
//     say.export(data, 'Alex', 0.75, 'test.wav', (err) => {
//         if (err) {
//           return console.error(err)
//         }
       
//         console.log('Text has been saved to test.wav.')
//       })
// })


// say.speak("What's up Hadi?", 'Alex', .5);
