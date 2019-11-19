/* ****************** MAIN.JS ******************
 * 2019 September 22 : Aaron Zhang : Created
 * 2019 October 23: Aaron Zhang : Modifed to fit in future angular class.
 ********************************************
 * Purpose : File that runs the webscraper_controller.js class. 
 * If you want to run the webscraper, this is the file to do it. 
*/
const WS_Controller = require("./webscraper_controller.js");
let EM = require("./emitter.js");
const fs = require("fs");

let webscraper_controller = new WS_Controller();

//webscraper_controller.getBingResults();
webscraper_controller.downloadAllMedia();
//webscraper_controller.webscrapeAllSites();
//webscraper_controller.convertAllTextToAudio();

