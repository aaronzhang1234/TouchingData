const axios = require("axios");
const cheerio = require("cheerio");
const url = require("url");
const winston = require("winston");
const path = require("path");
const fs = require("fs");
const download = require("download-file");
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');
const youtubedl = require("ytdl-core");
const DAO = require("../../DAO.js")
const Media = require("../../models/Media.js");
const EM = require("./emitter.js");

class webscraper{
    //Creating a websearch client using an API Key
    constructor(bing_APIKEY){  
        let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
        this.dao = new DAO(sqlDatabaseName);
        this.credentials = new CognitiveServicesCredentials(bing_APIKEY);
        this.webSearchAPIClient = new WebSearchAPIClient(this.credentials);

        //Creating a logger at the specified area.
        const logConfiguration = {
            'transports':[
                new winston.transports.File({
                    filename:'./logs/webscraper.log'
                })
            ]
        };
        this.logger = winston.createLogger(logConfiguration);
        console.log(`Scraper Created!\nCurrently logging at /logs/webscraper.log`);
    }
    //Getting a company's website using Bing
    getSiteFromName(companyName){
        let thisthat = this;
        return new Promise(function(resolve, reject){
            thisthat.webSearchAPIClient.web.search(companyName).then((results)=>{
                let numresults = Object.keys(results["webPages"]["value"]).length;
                resolve(results["webPages"]["value"][0]["url"]);
            }).catch((err)=>{
                thisthat.logger.error(err);
            }) })
    }
    /*
    Getting webscraped data from a site
    orig -> original website, straight from SQL
    website_name -> current site you are on
    links_visited -> a running total of links on the site
    .
    .
    stopTime -> Time in Epoch when the program is supposed to end.
    */
    async getSite(orig, website_name, links_visited, recipient_id, website_id, stopTime){
        //If time has run out then kill the program.
        EM.emit("fug");
        if(new Date().valueOf() > stopTime){
            return links_visited;
        }
        //If it is on the first page.
        if(orig == website_name){
            this.logger.info(`Scraping ${orig}`);
            this.findAbout(orig);
        }
        try{
            //await just pauses the execution until a response is recieved.
            const response = await axios.get(website_name, {timeout:10000}); 
            const $ = cheerio.load(response.data);
            await this.findAudio($, website_name, recipient_id, website_id);
            const links = await this.findLinks($, orig, website_name, links_visited);
            links_visited = links_visited.concat(links);
            
            //Because "this" doesn't work in promises or timeouts, we create a local variable which has a "this" instance.
            let thisthat = this;
            for(let i = 0; i < links.length-1; i++){
                if(new Date().valueOf() > stopTime){
                    return links_visited;
                }
                //Wait 5 seconds before continuing
                const waiting = await this.delay(5000);

                //Wait 5 seconds before going onto next website.
                //Webscraper will die on first page if this is not here.
                setTimeout(function(){
                    links_visited = links_visited.concat(thisthat.getSite(orig, links[i], links_visited, recipient_id, website_id, stopTime));
                    return links_visited;
                },5000);                
            }
        }catch(err){
            this.logger.error(`${err.message} at ${website_name}`);
            await this.delay(20000);
        }
    }

    findAbout(website){

    }
    findAudio($, website, recipient_id, website_id){
        let thisthat = this;
        return new Promise(function(resolve, reject){
           thisthat.logger.info(`Scraping : ${website}`);
            $("source").each((i, elem)=>{
                let src = $(elem).attr("src");
                if(src){
                    thisthat.logger.info(`Website Source is: ${website} | Link is: ${src}`);
                    let file_type = src.split(".").pop();
                    let media = new Media("",recipient_id,"" , file_type, "", src, website, website_id);
                    thisthat.dao.insertMedia(media);
                }
            });
            $("video").each((i, elem)=>{
                thisthat.logger.info(`Website Video is: ${website} | Link is: ${$(elem).attr("src")}`);
            });
            $("audio").each((i, elem)=>{
                thisthat.logger.info(`Website Audio is: ${website} | Link is: ${$(elem).attr("src")}`);
            });
            $("a[href*='/youtu.be/'],"+
              "a[href*='/youtube.com\\/embed/'],"+ 
              "a[href*='/youtube.com\\/watch/']"  ).each((i, elem)=>{
                let src = $(elem).attr("href");
                thisthat.logger.info(`Website href is ${website} | Youtube is: ${src}`);
                let media = new Media("",recipient_id,"" , "youtube", "", src,website, website_id);
                thisthat.dao.insertMedia(media);
            });
            resolve("");
        });
    }

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
            console.log(full_download_path);
            thisthat.dao.updateMediaPath(full_download_path, media_id);
            console.log("downloaded");
        })    
    }
    downloadYoutube(parent_directory, youtube_link){

        let DOWNLOAD_DIR =  "./data/scraped";
        var ytid = url.parse(youtube_link).pathname.split('/').pop();

        let full_download_path = path.join(DOWNLOAD_DIR, parent_directory, ytid+".mp4");
        console.log(full_download_path);
        try{
            let video = youtubedl(youtube_link);
            video.on('info', function(info){
                console.log(`File name is ${info._filename}`);
            });
            video.pipe(fs.createWriteStream(full_download_path));
        }catch(err){
            console.log(err);
        }
    }
    findLinks($, orig, current_site, links_visited){
        let links = [];
        return new Promise(function(resolve, reject){
            //Find every link on the webpage.
            $("a").each((i, elem)=>{        
                links.push($(elem).attr("href"));
            })

            //Remove all null objects from Array
            links = links.filter(function(item, idk){
                return item != null;
            });

            /*
            For Links such as href="/lets/go/../back.html", try to combine it the best you can.
             */
            for(let i =0 ;i< links.length-1; i++){
                if(!links[i].includes(".com") && 
                   !links[i].includes(".org") && 
                   !links[i].includes(".net") && 
                   !links[i].includes(".gov") && 
                   !links[i].includes(":")  ){
                    links[i] = url.resolve(current_site, links[i]);
                }
            }
            //Filter out static pages / same pages with locator
            links = links.filter(function(item, idk){
                return item.startsWith(orig) 
                       && !links_visited.includes(item) 
                       && !item.includes("#")
                       && !item.includes(".pdf")
                       && !item.includes(".png")
                       && !item.includes(".jpg")
                       && !item.includes(".xlsx")
                       && !item.includes(".zip");
            });

            //Convert array to Set to remove duplicates and convert set back to array
            const uniques = new Set(links);
            links = [...uniques];
            resolve(links);
        })
    }
    //Pause program for amount of milliseconds.
    delay(ms){
        return new Promise(resolve=>setTimeout(resolve, ms));
    }
}
module.exports = webscraper;