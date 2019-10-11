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

let dao = new DAO(sqlDatabaseName);
let recipients = dao.selectAllRecipients();
//console.log(recipients);

/*
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
*/


/* DOWNLOAD AN MP4
let DOWNLOAD_DIR =  "./data/scraped";
var src_name = url.parse(src_url).pathname.split('/').pop();
// compose the wget command
var wget = 'wget -P ' + DOWNLOAD_DIR + ' ' + src_url;
// excute wget using child_process' exec function
var child = exec(wget, function(err, stdout, stderr) {
    if (err) throw err;
    else console.log(src_name + ' downloaded to ' + DOWNLOAD_DIR);
});
*/


/*DOWNLOAD YOUTUBE LINK
var ytid = url.parse(youtube_link).pathname.split('/').pop();
let video = youtubedl(youtube_link);
video.on('info', function(info){
    console.log(`File name is ${info._filename}`);
});
video.pipe(fs.createWriteStream(`${DOWNLOAD_DIR}/${ytid}.mp4`));
*/
let howlong = 1;
let time = 0;
const minute  = 60000;

//OH BOY FUN TIMES
for(let i = 0; i<recipients.length; i++){
    let recipient = recipients[i];
    let recipient_id = recipient.website;
    console.log(recipient.name);
    //let website = dao.selectWebsiteByID(recipient_id);
    //let website_id = website.id;
    let stop_time = new Date().valueOf() + time +  (howlong*minute);
    setTimeout(function(){
        webscraper.getSite("https://adsinc.com/", "https://adsinc.com/",[], recipient_id, 0, stop_time );
    },time);
    time = time + (howlong * minute)
};
