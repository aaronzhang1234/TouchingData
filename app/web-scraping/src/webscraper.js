const axios = require("axios");
const cheerio = require("cheerio");
const url = require("url");
const exec = require("child_process").exec;
const fs = require('fs');
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');
const youtubedl = require("ytdl-core");
const sleep = require("sleep");

class webscraper{
    //Creating a websearch client using an API Key
    constructor(bing_APIKEY){  
        this.credentials = new CognitiveServicesCredentials("ce530745bc7b4a45b1c66356a9af2879");
        this.webSearchAPIClient = new WebSearchAPIClient(this.credentials);
        console.log("created");
    }
    //Getting a company's website using Bing
    getSiteFromName(companyName){
        this.webSearchAPIClient.web.search(companyName).then((results)=>{
            let numresults = Object.keys(results["webPages"]["value"]).length;
            for(var i =0; i<numresults-1 ;i++){                
                console.log(results["webPages"]["value"][i]);
            }
            //console.log(results["webPages"]["value"]);
        }).catch((err)=>{
            console.log(err)
        })
    }
    //Getting webscraped data from a site
    async getSite(orig, website_name, links_visited, stopTime){
        console.log(`Current time is ${new Date().getTime()} and stop time is ${stopTime}`);
        if(new Date().valueOf() < stopTime){
            if(orig == website_name){
                this.findAbout(orig);
            }
            const response = await axios.get(website_name);
            const $ = cheerio.load(response.data);
            await this.findAudio($, website_name);
            let thisthat = this;
            const links = await this.findLinks($, orig, website_name, links_visited);
            links_visited = links_visited.concat(links);
            for(let i = 0; i < links.length-1; i++){
                const waiting = await this.delay(4000);
                setTimeout(function(){
                    links_visited = links_visited.concat(thisthat.getSite(orig, links[i], links_visited, stopTime));
                    return links_visited;
                },5000)
            }
        }
        return;
    }
    findAbout(website){

    }
    findAudio($, website){
        console.log("Scraping : " + website);
        return new Promise(function(resolve, reject){
            console.log("Scraping : " + website);
            $("source").each((i, elem)=>{
                console.log("Website Source is: " + website + " | Link is: " + $(elem).attr("src"));
                let src_url = $(elem).attr("src");
                console.log("downloading");
                let DOWNLOAD_DIR =  "./data/scraped";
                var src_name = url.parse(src_url).pathname.split('/').pop();
                // compose the wget command
                var wget = 'wget -P ' + DOWNLOAD_DIR + ' ' + src_url;
                // excute wget using child_process' exec function
                var child = exec(wget, function(err, stdout, stderr) {
                    if (err) throw err;
                    else console.log(src_name + ' downloaded to ' + DOWNLOAD_DIR);
                });
            });
            $("video").each((i, elem)=>{
                console.log("Website Video is: " + website + " | Link is: " + $(elem).attr("src"));
            });
            $("audio").each((i, elem)=>{
                console.log("Website Audio is: " + website + " | Link is: " + $(elem).attr("src"));
            });
            $("a[href*='/youtu.be/']").each((i, elem)=>{
                let DOWNLOAD_DIR =  "./data/scraped";
                console.log("Website href is " + website + " | Link is: " + $(elem).attr("href"));

                console.log("youtube");
                let youtube_link = $(elem).attr("href");
                var ytid = url.parse(youtube_link).pathname.split('/').pop();
                let video = youtubedl(youtube_link);
                video.on('info', function(info){
                    console.log(`File name is ${info._filename}`);
                });
                video.pipe(fs.createWriteStream(`${DOWNLOAD_DIR}/${ytid}.mp4`));
                
            });
            resolve("");
        });
    }
    findLinks($, orig, current_site, links_visited){
        let links = [];
        return new Promise(function(resolve, reject){
            $("a").each((i, elem)=>{        
                links.push($(elem).attr("href"));
            })
            //Convert array to Set to remove duplicates and convert set back to array
            const uniques = new Set(links);
            links = [...uniques];
            links = links.filter(function(item, idk){
                return item != null;
            });
            for(let i =0 ;i< links.length-1; i++){
                if(!links[i].includes(".com") && 
                   !links[i].includes(".org") && 
                   !links[i].includes(".net") && 
                   !links[i].includes(".gov") && 
                   !links[i].includes(".jpg") &&
                   !links[i].includes(".pdf") &&
                   !links[i].includes("://") &&
                   !links[i].includes(":") &&
                   !links[i].includes("#")){
                    if(current_site.substr(-1) == "/" && links[i].substr(0)=="/"){
                        let current_site_no_leading = current_site.substr(0,current_site.length-1);                        
                        links[i] = current_site_no_leading+links[i];
                    }else if(current_site.substr(-1) != "/" && links[i].substr(0)!="/"){
                        links[i] = current_site+"/"+links[i];
                    }else{
                        links[i] = current_site+links[i];
                    }
                }
            }
            links = links.filter(function(item, idk){
                return item.startsWith(orig) 
                       && !links_visited.includes(item) 
                       && !item.includes("#")
                       && !item.includes(".pdf")
                       && !item.includes(".png")
                       && !item.includes(".jpg");
            });
            resolve(links);
        })
    }
    delay(ms){
        return new Promise(resolve=>setTimeout(resolve, ms));
    }
}
module.exports = webscraper;