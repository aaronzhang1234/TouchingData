/* ****************** MAIN.JS ******************
 * 2019 October 23 : Aaron Zhang : Created
 ********************************************
 * Purpose : File that runs the webscraper.js class. *
*/

const webscraperjs = require("./webscraper.js");
const DAO = require("../../DAO.js");
let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
let Website = require("../../models/Website.js");
let EM = require("./emitter.js");
const url = require("url");

class WS_Controller{
    constructor(){
        this.webscraper = new webscraperjs("ce530745bc7b4a45b1c66356a9af2879");    
        this.dao = new DAO(sqlDatabaseName);
    }
    getBingResults(){
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
    }
    webscrapeAllSites(){
        let recipients = this.dao.selectAllRecipients();
        let howlong = 1;
        let time = 0;
        const minute  = 60000;
        //OH BOY FUN TIMES
        for(let i = 0; i<recipients.length; i++){
            
            let recipient = recipients[i];
            let recipient_website_id = recipient.website;
            let website = this.dao.selectWebsite(recipient_website_id);
            let website_domain  = website.domain;
            //let website_domain = "https://www.dtccom.net/";

            let stop_time = new Date().valueOf() + time +  (howlong*minute);
            let thisthat = this;
            setTimeout(function(){
                let links_visited =  thisthat.webscraper.getSite(website_domain, website_domain,[website_domain], recipient.id, recipient_website_id, stop_time );
            },time);
            time = time + (howlong * minute)
        };
    }
    downloadAllMedia(){
        let medias = dao.selectAllMedia();
        let time = 1000;
        for(let i = 0; i<medias.length; i++){
            let media = medias[i];
            let recipient = this.dao.selectRecipientById(media.recipient);
            let media_url = media.url;
            let media_source = media.source;
            time = time + 2000;
            setTimeout(function(){
                if(media.fileType == "youtube"){
                    webscraper.downloadYoutube(recipient.name, media_source);        
                }else{
                    /*
                    let full_link = url.resolve(media_url, media_source);
                    webscraper.downloadFile(recipient.name, full_link);
                    */
                }
            },time);
        }
    }
}
module.exports = WS_Controller;