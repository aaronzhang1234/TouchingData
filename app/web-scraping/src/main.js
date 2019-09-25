/* ****************** MAIN.JS ******************
 * 2019 September 22 : Aaron Zhang : Created
 ********************************************
 * Purpose : File that runs the webscraper.js class. 
 *
*/

const webscraperjs = require("./webscraper.js");
const DAO = require("../../DAO.js");
const Company = require("../../models/Company.js");

let sqlDatabaseName = "data/POLITICS_OF_THE_GRID_1.db";
var dao = new DAO(sqlDatabaseName);

var webscraper = new webscraperjs();
webscraper.getSiteFromName("Federal Express Corporation");
webscraper.getSite("http://aaronzhang.xyz");