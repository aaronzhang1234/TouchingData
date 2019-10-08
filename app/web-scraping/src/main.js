/* ****************** MAIN.JS ******************
 * 2019 September 22 : Aaron Zhang : Created
 ********************************************
 * Purpose : File that runs the webscraper.js class. 
 *
*/

const webscraperjs = require("./webscraper.js");
const DAO = require("../../DAO.js");
let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";


var webscraper = new webscraperjs();
//webscraper.getSiteFromName("Federal Express Corporation");
let seconds = 600;
let stopTime = new Date().valueOf() + (seconds*1000);

let dao = new DAO(sqlDatabaseName);
let recipients = dao.selectAllRecipients();
//console.log(recipients);

for(let i =0; i<10; i++){
    let recipient = recipients[i];
    webscraper.getSiteFromName(recipient.name).then(function(url){
        dao.insertWebsite(url);
        console.log(url);
    });
}



//webscraper.getSite("https://www.varidesk.com/", "https://www.varidesk.com/",[], stopTime);