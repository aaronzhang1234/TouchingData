const axios = require("axios");
const cheerio = require("cheerio");
const url = require("url");
const {transports, createLogger, format} = require("winston");
const path = require("path");
const fs = require("fs");
const download = require("download-file");
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');
const youtubedl = require("ytdl-core");
const DAO = require("../../DAO.js")
const Media = require("../../models/Media.js");
const EM = require("./emitter.js");
const Pusher = require("pusher");


class webscraper{
    //Creating a websearch client using an API Key
    constructor(bing_APIKEY){  
        let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
        this.dao = new DAO(sqlDatabaseName);
        this.credentials = new CognitiveServicesCredentials(bing_APIKEY);
        this.webSearchAPIClient = new WebSearchAPIClient(this.credentials);
        this.pusher = new Pusher({
            appId: '894938',
            key: 'f1731416f119bafdc832',
            secret: '2ded923ed65f4885008f',
            cluster: 'us2',
            encrypted: true
        });

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

    //Getting a company's website using Bing
    getSiteFromName(companyName){
        let thisthat = this;
        return new Promise(function(resolve, reject){
            thisthat.webSearchAPIClient.web.search(companyName).then((results)=>{
                let confidence_arr = [];
                let numresults = Object.keys(results["webPages"]["value"]).length;
                for(let i = 0; i<numresults-1; i++){
                    let confidence_val = 0;
                    let cur_url_str = results["webPages"]["value"][i]["url"];
                    let cur_url = new URL(cur_url_str);
                    let cur_length = cur_url_str.length;

                    let cur_path = cur_url.pathname;
                    let length_multiplier = (1 / (cur_length / 50));
                    let path_lenth = cur_url_str.split("/").length;
                    let num_length = cur_url_str.replace(/[^0-9]/g,"").length;
                    console.log(cur_url_str);
                    console.log(cur_path);
                    console.log(length_multiplier);
                    console.log(path_lenth);
                    console.log(num_length);
                }
                resolve(results["webPages"]["value"][0]["url"]);
            }).catch((err)=>{
                thisthat.logger.error(err);
            }) 
        });
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
    async getSite(orig, website_name, links_visited, recipient, stopTime){
        //If time has run out then kill the program.
        this.pusher.trigger('my-channel','my-event',{
            "message":website_name
        });
        if(new Date().valueOf() > stopTime){
            return links_visited;
        }
        //If it is on the first page.
        try{
            //await just pauses the execution until a response is recieved.
            const response = await axios.get(website_name, {timeout:10000}); 
            const $ = cheerio.load(response.data);
            if(links_visited.length == 1){
                this.findAbout($, orig, recipient).catch((err)=>this.logger.error(err));
            }
            await this.findAudio($, website_name, recipient.id, recipient.website);
            const links = await this.findLinks($, orig, website_name, links_visited);
            links_visited = links_visited.concat(links);
            
            //Because "this" doesn't work in promises or timeouts, we create a local variable which has a "this" instance.
            let thisthat = this;
            for(let i = 0; i < links.length-1; i++){
                if(new Date().valueOf() > stopTime){
                    return links_visited;
                }
                //Wait 5 seconds before continuing
                const waiting = await this.delay(2000);

                //Wait 5 seconds before going onto next website.
                //Webscraper will die on first page if this is not here.
                setTimeout(function(){
                    links_visited = links_visited.concat(thisthat.getSite(orig, links[i], links_visited, recipient, stopTime));
                    return links_visited;
                },5000);                
            }
        }catch(err){
            this.logger.error(`${err.message} at ${website_name}`);
            await this.delay(20000);
        }
    }

    async findAbout($, orig, recipient){
        let thisthat = this;
        let recipient_name = recipient.name;
        recipient_name = recipient_name.replace(/ /g, "_");
        recipient_name = recipient_name.replace(/\./g, "");
        recipient_name = recipient_name.replace(/,/g, "");
        let about_parent_path = path.join("./data/abouts", recipient_name);
        let links = [];
        await $("a").each((i, elem)=>{        
            let href = $(elem).attr("href");
            if(href!=null){
                let full_url = url.resolve(orig, href);
                let a_text = $(elem).text();
                if(full_url.startsWith(orig)
                    && !full_url.includes("#")
                    && !full_url.toLowerCase().includes("wikipedia")
                    && (full_url.toLowerCase().includes("about")
                     || full_url.toLowerCase().includes("company")
                     || a_text.toLowerCase().includes("about")
                     || a_text.toLowerCase().includes("company"))){
                        links.push(full_url);
                }
            }
        })
        links = this.removeDuplicatesInArrays(links);
        this.logger.info(`Found ${links.length} About Page(s) for ${recipient.name}`);
        if(links.length >= 1){
            await fs.mkdir(about_parent_path, err=>{
                if(err) thisthat.logger.error(err);
            })
        }
        for(let i = 0; i< links.length; i++){   
            let about_path = path.join(about_parent_path, (i+1).toString() + ".txt");

            fs.writeFile(about_path, links[i] + '\n', {flag: 'a+'}, function(err){
                if(err) thisthat.logger.error(err);
                thisthat.logger.info(`About Page Link written to ${about_path}`);
            })
            const response = await axios.get(links[i], {timeout:10000}); 
            const $ = cheerio.load(response.data);

            let about_media = new Media();
            //Take each paragraph and add them in order to a txt file.
            await $("p").each((i, elem)=>{ 
                let paragraph_text = $(elem).text();
                paragraph_text = paragraph_text.trim();
                if(paragraph_text.length > 100){
                    fs.writeFile(about_path, paragraph_text + '\n', {flag: 'a+'}, function(err){
                        if(err) thisthat.logger.error(err);
                    })
                }
            })
            await this.delay(2000);
        }
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
            thisthat.logger.info(`Downloading ${full_download_path}`);
            thisthat.dao.updateMediaPath(full_download_path, media_id);
        }) 
    }

    downloadYoutube(parent_directory, youtube_link){
        let DOWNLOAD_DIR =  "./data/scraped";
        var ytid = url.parse(youtube_link).pathname.split('/').pop();

        let full_download_path = path.join(DOWNLOAD_DIR, parent_directory, ytid+".mp4");
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
        let thisthat = this;
        return new Promise(function(resolve, reject){
            //Find every link on the webpage and add it to an array.
            $("a").each((i, elem)=>{        
                let href = $(elem).attr("href");
                if(href!=null){
                    //If the link is a partial link then try to append to it to the current site.
                    let full_url = url.resolve(current_site, href);
                    if(full_url.startsWith(orig)
                       && !links_visited.includes(full_url)
                       && !full_url.includes("#")
                       && !full_url.includes(".pdf")
                       && !full_url.includes(".png")
                       && !full_url.includes(".jpg")
                       && !full_url.includes(".xlsx")
                       && !full_url.includes(".zip")){
                          links.push(full_url);
                    }
                }
            })
            
            //Convert array to Set to remove duplicates and convert set back to array
            links = thisthat.removeDuplicatesInArrays(links);
            resolve(links);
        })
    }

    removeDuplicatesInArrays(arr){
        const uniques = new Set(arr);
        arr = [...uniques];
        return arr;
    }

    //Pause program for amount of milliseconds.
    delay(ms){
        return new Promise(resolve=>setTimeout(resolve, ms));
    }
}
module.exports = webscraper;
