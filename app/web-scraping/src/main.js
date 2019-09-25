/* ****************** MAIN.JS ******************
 * 2019 September 22 : Aaron Zhang : Created
 ********************************************
 * Purpose : File that runs the webscraper.js class. 
 *
*/

const webscraperjs = require("./webscraper.js");
const DAO = require("../../DAO.js");
const Company = require("../../models/Company.js");
const db = require('better-sqlite3')('data/POLITICS_OF_THE_GRID_1.db');

//const row = db.prepare("INSERT INTO pg1_company (name, addr1, addr2, city, state, zip, congressionalDistrict) VALUES(?,?,?,?,?,?,?)").run("","1","312","","123","hj","");

var webscraper = new webscraperjs();
//webscraper.getSiteFromName("Federal Express Corporation");
webscraper.getSite("https://adsinc.com/", "https://adsinc.com/",[]);