/* ****************** RUN_DOWNLOADMEDIA.JS ******************
 * 2019 November 18 : Aaron Zhang : Created
 ********************************************
 * Purpose : File that runs the download media functions from the webscraper class. 
 */
const WS_Controller = require("../src/webscraper_controller.js");

let webscraper_controller = new WS_Controller();

webscraper_controller.downloadAllMedia();