/* ****************** RUN_DOWNLOADMEDIA.JS ******************
 * 2019 November 18 : Aaron Zhang : Created
 ********************************************
 * Purpose : File that runs the download media functions from the webscraper class. 
 */
const DL_Controller = require("../src/downloader_controller.js");

let downloader_controller = new DL_Controller();

downloader_controller.downloadAllMedia();