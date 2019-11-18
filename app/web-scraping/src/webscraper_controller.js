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
let timeouts = [];

class WS_Controller {
  constructor() {
    this.bing_api_key = "458f7fc0ea5c44d38e45178c62515c7b";
    this.webscraper = new webscraperjs();
    this.dao = new DAO(sqlDatabaseName);
  }
  getBingResults() {
    let recipients = this.dao.selectAllRecipients();
    let time = 1000;
		let state = "go"
    //Since you cannot use "this" in a promise, put "this" in a local variable.
    let thisthat = this;
		EM.on("kill",function(data) {
			timeouts.forEach(timeout=>{
				clearTimeout(timeout);
				state = "stop";
			});
		});
		for (let i = 0; i < recipients.length; i++) {
			if (state === "stop") return;
      let recipient = recipients[i];
      //If the recipient row in the DB does not have a corresponding website variable.
      if(recipient.website == null || recipient.website == ""){
        //Adding 3 seconds to the amount of time needing to wait.
        time = time + 3000;
        let progress = i/recipients.length * 100;
        //Setting a timeout allows the function to run syncronously inside a node function. 
				//The main goal is to allow the first info to go in 3 seconds, then 3 seconds after that run the second inf

        const timeoutObj = setTimeout(function() {
					thisthat.webscraper.getSiteFromName(recipient.name, thisthat.bing_api_key).then(function(url) {
						console.log(url);
						EM.emit('websiteUrl', {
              urlResult: url,
              companyName: recipient.name,
              urlProgress: progress
            });
            let website = new Website("", url);
            thisthat.dao.insertWebsite(website);
            //This gets the ID of the website we just inserted into the database to insert into the recipient table
            website = thisthat.dao.selectWebsiteByDomain(url);
            //The ID gets returned in a num format and we have to turn it into a string. Trust me, this is the easiest way to do it
            let num_string = String(website.id);
            let num_array = num_string.split(".");
            let website_id = num_array[0];
            thisthat.dao.updateRecipientWebsite(recipient.id, website_id);
          });
        }, time);
				timeouts.push(timeoutObj)
      }
    }
  }
  async webscrapeAllSites() {
    fs.mkdir("data/abouts", err=>{
      console.log(`Problem Creating the data/abouts folder. \n Honestly, 70% chance it's already created`);
    }); 
    let recipients = this.dao.selectAllRecipients();
    let howlong = .25; //In percentages of a minute. .25 = 15 seconds
    let time = 0;
    const minute = 60000; //Time is in milliseconds
		let state = "go";

		EM.on("kill",function(data) {
			timeouts.forEach(timeout=>{
				clearTimeout(timeout);
				state = "stop";
			});
		});
    for (let i = 0; i < recipients.length; i++) {
			if (state === "stop") return;
      let recipient = recipients[i];
      let recipient_id = recipient.id;
      let recipient_website_id = recipient.website;
      let website = this.dao.selectWebsiteById(recipient_website_id);

      let website_domain = website.domain;

//      website_domain =  "https://www.dtccom.net/";
      //Origin is the website without anything after the domain name.
      let origin = new URL(website_domain).origin;
      //howlong * minutes should be the amount of time waiting between each website
      time = time + howlong * minute;
      //stop_time is the cumulative amount of time before the website function stops.
      let stop_time = new Date().valueOf() + time;
      let thisthat = this;

      const timeoutObj = setTimeout(function() {
				console.log(website);
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
			timeouts.push(timeoutObj);
    }
  }
  downloadAllMedia() {
    let medias = this.dao.selectAllMedia();
    let time = 1000;
    let thisthat = this;
		let state = "go";
		EM.on("kill",function(data) {
			timeouts.forEach(timeout=>{
				clearTimeout(timeout);
				state = "stop";
			});
		});
    for (let i = 0; i < medias.length; i++) {
			if (state === "stop") return;
      let media = medias[i];
      let recipient = this.dao.selectRecipientById(media.recipient);
      //In order to be read in Max, the name of the recipient must have no spaces, periods, or commas.
			let name = this.webscraper.getParentPath(recipient.name)
      let media_source = media.url;      
      //Wait around 2 seconds between each downloading media
			time = time + 2000;
			const timeoutObj =	setTimeout(function() {
				console.log(media)
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
			timeouts.push(timeoutObj);
    }
  }
  //recieves in all text files from db
  //calls function to convert each file individually
  convertAllTextToAudio() {
    let texts = this.dao.selectAllTextFiles();
    let time = 1000;
    let thisthat = this;
		let state = "go";

		EM.on("kill",function(data) {
			timeouts.forEach(timeout=>{
				clearTimeout(timeout);
				state = "stop";
			});
		});

    for(let i = 0; i<texts.length; i++) {
			if(state==="stop") return;
      let text = texts[i];
      let recipient = this.dao.selectRecipientById(text.recipient);
      let name = thisthat.webscraper.getParentPath(recipient.name);
      let recipientId = recipient.id;
      time = time + 2000;
      const timeoutObj = setTimeout(function() {
				console.log(recipient);
        let progress = i/texts.length * 100;
        EM.emit('textToAudioStatus', {
          textFileName: text.filePath,
          textConversionProgress: progress
        })
        thisthat.webscraper.convertTextToAudio(name, text.filePath, text.website_id, text.id, recipientId);
      }, time);
			timeouts.push(timeoutObj);
    }
  }
}

module.exports = WS_Controller;
