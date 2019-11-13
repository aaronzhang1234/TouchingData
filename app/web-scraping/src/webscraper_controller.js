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
const fs = require("fs");
const url = require("url");

class WS_Controller {
  constructor() {
    this.webscraper = new webscraperjs("458f7fc0ea5c44d38e45178c62515c7b");
    this.dao = new DAO(sqlDatabaseName);
  }
  getBingResults() {
    let recipients = this.dao.selectAllRecipients();
    let time = 1000;
    let thisthat = this;
    for (let i = 0; i < recipients.length; i++) {
      let recipient = recipients[i];
      if(recipient.website == null || recipient.website == ""){
        time = time + 3000;
        let progress = i/recipients.length * 100;
        setTimeout(function() {
          thisthat.webscraper.getSiteFromName(recipient.name).then(function(url) {
            EM.emit('websiteUrl', {
              urlResult: url,
              companyName: recipient.name,
              urlProgress: progress
            });
            let website = new Website("", url);
            thisthat.dao.insertWebsite(website);
            website = thisthat.dao.selectWebsiteByDomain(url);
            let num_string = String(website.id);
            let num_array = num_string.split(".");
            let website_id = num_array[0];
            thisthat.dao.updateRecipientWebsite(recipient.id, website_id);
          });
        }, time);
      }
    }
  }
  async webscrapeAllSites() {
    fs.mkdir("data/abouts", err=>{
      console.log(`Problem Creating the data/abouts folder. \n Honestly, 70% chance it's already created`);
    }); 
    let recipients = this.dao.selectAllRecipients();
    let howlong = .25;
    let time = 0;
    const minute = 60000;

    for (let i = 0; i < recipients.length; i++) {
      let recipient = recipients[i];
      let recipient_id = recipient.id;
      let recipient_website_id = recipient.website;
      let website = this.dao.selectWebsiteById(recipient_website_id);

      let website_domain = website.domain;

//      website_domain =  "https://www.dtccom.net/";
      let origin = new URL(website_domain).origin;
      let stop_time = new Date().valueOf() + time + howlong * minute;
      let thisthat = this;

      setTimeout(function() {
        let progress = i/recipients.length * 100;
        EM.emit("website", 
        {websiteName: website_domain,
          webscrapeProgress: progress
        });
        let links_visited = thisthat.webscraper.getSite(
          origin,
          website_domain,
          [website_domain],
          recipient_id,
          stop_time
        );
      }, time);

      time = time + howlong * minute;
    }
  }
  downloadAllMedia() {
    let medias = this.dao.selectAllMedia();
    let time = 1000;
    let thisthat = this;
    for (let i = 0; i < medias.length; i++) {
      let media = medias[i];
      let recipient = this.dao.selectRecipientById(media.recipient);
			let name = this.webscraper.getParentPath(recipient.name)
      let media_source = media.url;      
			time = time + 2000;
			setTimeout(function() {
        let progress = i/medias.length * 100;
        EM.emit('downloadMediaStatus', {
          mediaFileName: media.filePath,
          mediaDownloadProgress: progress
        })
        console.log(progress);
				if (media.kind == "youtube") {
					thisthat.webscraper.downloadYoutube(name, media_source, media.id);
				} else {
          thisthat.webscraper.downloadFile(name, media_source, media.id);
        }
      }, time);
    }
  }
}

module.exports = WS_Controller;
