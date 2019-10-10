/* ****************** MAIN.JS ******************
 * 2019 September 22 : Aaron Zhang : Created
 ********************************************
 * Purpose : File that runs the webscraper.js class. 
 *
*/

const webscraperjs = require("./webscraper.js");
const DAO = require("../../DAO.js");
let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
let Website = require("../../models/Website.js");

var webscraper = new webscraperjs();
//webscraper.getSiteFromName("Federal Express Corporation");
let seconds = 600;
let stopTime = new Date().valueOf() + (seconds*1000);

let dao = new DAO(sqlDatabaseName);
let recipients = dao.selectAllRecipients();
//console.log(recipients);

let time = 1000;
for(let i =0; i<recipients.length; i++){
    time = time + 3000;
    let recipient = recipients[i];    
    setTimeout(function(){
        webscraper.getSiteFromName(recipient.name).then(function(url){
            let website = new Website("", url);
            dao.insertWebsite(website);
            console.log(url);        
            website = dao.selectWebsite(url);
            console.log(website.id);
            let num_string = String(website.id);
            let num_array = num_string.split(".");
            let website_id =  num_array[0];
            dao.updateRecipientWebsite(recipient.id, website_id);
        });
    }, time);
}



//webscraper.getSite("https://adsinc.com/", "https://adsinc.com/",[], stopTime);