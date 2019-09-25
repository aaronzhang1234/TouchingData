/* ****************** MAIN.JS ******************
 * 2019 September 22 : Aaron Zhang : Created
 ********************************************
 * Purpose : File that runs the webscraper.js class. 
 *
*/

const webscraperjs = require("./webscraper.js");

var webscraper = new webscraperjs();
webscraper.getSite("http://aaronzhang.xyz");