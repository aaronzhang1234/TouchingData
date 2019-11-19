/* ****************** RUN_TEXTAUDIO.JS ******************
 * 2019 November 11 : Hadi Haidar : Created
 ********************************************
 * Purpose : File that runs saves files as text to audio *
 */
const WS_Controller = require("../src/webscraper_controller.js");

let webscraper_controller = new WS_Controller();

webscraper_controller.convertAllTextToAudio();