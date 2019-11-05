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
      time = time + 3000;
      let recipient = recipients[i];
      setTimeout(function() {
        thisthat.webscraper.getSiteFromName(recipient.name).then(function(url) {
          console.log(url);
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
  webscrapeAllSites() {
    let recipients = this.dao.selectAllRecipients();
    let howlong = .25;
    let time = 0;
    const minute = 60000;
    //OH BOY FUN TIMES
    for (let i = 0; i < recipients.length; i++) {
      let recipient = recipients[i];
      let recipient_website_id = recipient.website;
      let website = this.dao.selectWebsiteById(recipient_website_id);

      let website_domain = website.domain;
//      website_domain = "http://www.enterprisesol.com/";

      let origin = new URL(website_domain).origin;
      let stop_time = new Date().valueOf() + time + howlong * minute;
      let thisthat = this;

      setTimeout(function() {
        let links_visited = thisthat.webscraper.getSite(
          origin,
          website_domain,
          [website_domain],
          recipient,
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
      let media_url = media.url;
      let media_source = media.source;      
      time = time + 2000;
      setTimeout(function() {
        if (media.fileType == "youtube") {
          // webscraper.downloadYoutube(recipient.name, media_source);
        } else {
          let name = recipient.name;
          name = name.replace(/ /g, "_");
          name = name.replace(/\./g, "");
          name = name.replace(/,/g, "");

          let full_link = url.resolve(media_url, media_source);
          thisthat.webscraper.downloadFile(name, full_link, media.id);
        }
      }, time);
    }
  }
}

module.exports = WS_Controller;
