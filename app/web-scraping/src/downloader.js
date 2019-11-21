const download = require("download-file");
const url = require("url");
const {transports, createLogger, format} = require("winston");
const path = require("path");
const fs = require("fs");
//const download = require("download-file");
const youtubedl = require("ytdl-core");
const DAO = require("../../DAO.js")
const Media = require("../../models/Media.js");
const say = require('say');


class downloader {
    constructor(){
        let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
        this.dao = new DAO(sqlDatabaseName);

        //Creating a logger at the specified area.
        this.logger = createLogger({
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            transports: [
                new transports.File({filename: 'logs/webscraper.log'})
            ]
        });         

        console.log(`Scraper Created!\nCurrently logging at /logs/webscraper.log`);
    }
    /*
    Download a media file.
    parent_directory -> path to the directory where the media will be saved. IE: data/scraped/RECIPIENT_NAME 
    full_url -> Path to the media file on the company's website
    media_id -> SQL ID of the current Media file
    */
    downloadFile(parent_directory , full_url, media_id){
        let DOWNLOAD_DIR =  "./data/scraped";
        var src_name = url.parse(full_url).pathname.split('/').pop();
        let parent_path = path.join(DOWNLOAD_DIR, parent_directory);
        let full_download_path = path.join(parent_path, src_name);
        let thisthat = this;
        var options = {
            directory: parent_path,
            filename: src_name
        }
        download(full_url, options, function(err){
            if(err) console.log(err); 
            thisthat.logger.info(`Downloading ${full_download_path}`);
            thisthat.dao.updateMediaPath(full_download_path, media_id);
        }) 
    }

    /*
    Download a youtube file 
    parent_directory -> path to the directory where the media will be saved. IE: data/scraped/RECIPIENT_NAME 
    youtube_link -> URL of the youtube video
    media_id -> SQL ID of the current Media file
    */
    downloadYoutube(parent_directory, youtube_link, media_id){
        let DOWNLOAD_DIR =  "./data/scraped";
        var ytid = url.parse(youtube_link).pathname.split('/').pop();
        if (ytid === null){return}
        if (!youtube_link.includes("http")){
            youtube_link = "https:"+youtube_link
        }
        let full_download_path = path.join(DOWNLOAD_DIR, parent_directory, ytid+".mp4");
        if (!fs.existsSync(path.join(DOWNLOAD_DIR,parent_directory))){
                fs.mkdirSync(path.join(DOWNLOAD_DIR,parent_directory));
        }
        try{
            this.dao.updateMediaPath(full_download_path, media_id);
            new Promise((resolve)=> {
                youtubedl(youtube_link)
                    .on('progress',(length,downloaded, totallength)=> {
                        const progress = (downloaded/totallength) * 100;
                    })
                    .pipe(fs.createWriteStream(full_download_path))
                    .on('finish',()=> {
                        resolve();
                    })
                    .on('error',()=>{
                        resolve();
                    })
            });
            
        }catch(err){
            console.log(err);
        }
    }
    async convertTextToAudio(parent_directory, textFilePath, websiteId, textId, recipientId){
        let thisthat = this;
        let DOWNLOAD_DIR =  "./data/scraped";
        let fileName = path.basename(textFilePath, '.txt') + '.wav';
        let parent_path = path.join(DOWNLOAD_DIR, parent_directory);
        let full_download_path = path.join(parent_path, fileName);
        if (!fs.existsSync(path.join(DOWNLOAD_DIR,parent_directory))){
            fs.mkdirSync(path.join(DOWNLOAD_DIR,parent_directory));
        }
        return new Promise(function(resolve, reject){
            if(fs.existsSync(textFilePath)){
                console.log(textFilePath);
                fs.readFile(textFilePath, "utf-8", function(err, data){
                    if(err) throw err;
                    say.export(data, 'Alex', 1, full_download_path, (err) => {
                        if (err) {
                            console.error(err)
                        }
                        let media = new Media(null,recipientId,full_download_path,'wav',null, textFilePath, websiteId, textId, null, 'audio');
                        thisthat.dao.insertMedia(media);                   
                        console.log('Text has been saved to ' + full_download_path);
                        resolve("Finished!");
                    })
                })
            }else{
                resolve("Resolved");
            }
        })
    }
    /*
    Because cannot read certain folders, remove all spaces, commas, and periods from a recipient's name
    name -> The recipient's name.
    */
	getParentPath(name){
		name = name.replace(/ /g, "_");
		name = name.replace(/\./g, "");
		return name.replace(/,/g, "");
    }
}
module.exports = downloader;