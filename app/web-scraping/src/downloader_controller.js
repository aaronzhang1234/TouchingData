const downloaderjs = require("./downloader.js");
const DAO = require("../../DAO.js");
let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
let EM = require("../../emitter.js");
let timeouts = [];

class DL_Controller {
  constructor() {
    //This API key is used for gathering websites and the free tier is limited for 3000 searches.
    //More information about this can be found at docs/Bing API Documentation for Touching Data.docx.
    this.downloader = new downloaderjs();
    this.dao = new DAO(sqlDatabaseName);
  }
  downloadAllMedia() {
    let medias = this.dao.selectAllMedia();
    let time = 0
    let thisthat = this;
		let state = "go";
		EM.on("kill",function(data) {
			timeouts.forEach(timeout=>{
				clearTimeout(timeout);
			});
			state = "stop";
		});
		for (let i = 0; i < medias.length; i++) {
			if (state === "stop") return;
      let media = medias[i];
      let recipient = this.dao.selectRecipientById(media.recipient); 
      //In order to be read in Max, the name of the recipient must have no spaces, periods, or commas.
			let name = this.downloader.getParentPath(recipient.name)
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
				if (media.kind == "youtube") {
					thisthat.downloader.downloadYoutube(name, media_source, media.id);
				} else {
					thisthat.downloader.downloadFile(name, media_source, media.id);
				}
			}, time);
			timeouts.push(timeoutObj);
		}
	}
	//recieves in all text files from db
	//calls function to convert each file individually
	async convertAllTextToAudio() {
		let texts = this.dao.selectAllTextFiles();
		let time = 1000;
		let thisthat = this;
		let state = "go";

		EM.on("kill",function(data) {
			state = "stop";
		});

		for(let i = 0; i<texts.length; i++) {
			if(state === "stop") return;
			let text = texts[i];
			let recipient = this.dao.selectRecipientById(text.recipient);
			let name = thisthat.downloader.getParentPath(recipient.name);
			let recipientId = recipient.id;

			let progress = i/texts.length * 100;
			EM.emit('textToAudioStatus', {
				textFileName: text.filePath,
				textConversionProgress: progress
			})
			await thisthat.downloader.convertTextToAudio(name, text.filePath, text.website_id, text.id, recipientId);
		}
		console.log("finished!");
	}
}
module.exports = DL_Controller;