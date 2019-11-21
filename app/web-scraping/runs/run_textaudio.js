/* ****************** RUN_TEXTAUDIO.JS ******************
 * 2019 November 11 : Hadi Haidar : Created
 ********************************************
 * Purpose : File that runs saves files as text to audio *
 */
const DL_Controller = require("../src/downloader_controller.js");

let downloader_controller = new DL_Controller(); 

downloader_controller.convertAllTextToAudio();