const axios = require("axios");
const cheerio = require("cheerio");
const url = require("url");
const exec = require("child_process").exec;
const fs = require('fs');
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');
const youtubedl = require("ytdl-core");
const DAO = require("../../DAO.js")
const Media = require("../../models/Media.js");

class webscraper{
    //Creating a websearch client using an API Key
    constructor(bing_APIKEY){  
        let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
        this.dao = new DAO(sqlDatabaseName);
        this.credentials = new CognitiveServicesCredentials("ce530745bc7b4a45b1c66356a9af2879");
        this.webSearchAPIClient = new WebSearchAPIClient(this.credentials);
        console.log("created");
    }
    //Getting a company's website using Bing
    getSiteFromName(companyName){
        let thisthat = this;
        return new Promise(function(resolve, reject){
            thisthat.webSearchAPIClient.web.search(companyName).then((results)=>{
                console.log(companyName);
                let numresults = Object.keys(results["webPages"]["value"]).length;
                resolve(results["webPages"]["value"][0]["url"]);
            }).catch((err)=>{
                console.log(err)
            })
        })
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
        if(new Date().valueOf() > stopTime){
            return;
        }
        if(orig == website_name){
            console.log("welcome to new shit");
            this.findAbout(orig);
        }
        try{
            const response = await axios.get(website_name); 
            const $ = cheerio.load(response.data);
            await this.findAudio($, website_name, recipient_id, website_id);
            const links = await this.findLinks($, orig, website_name, links_visited);
            links_visited = links_visited.concat(links);
            let thisthat = this;
            for(let i = 0; i < links.length-1; i++){
                if(new Date().valueOf() > stopTime){
                    return;
                }
                const waiting = await this.delay(5000);
                setTimeout(function(){
                    links_visited = links_visited.concat(thisthat.getSite(orig, links[i], links_visited, recipient_id, website_id, stopTime));
                    return links_visited;
                },5000);                
            }
        }catch(err){
            await this.delay(20000);
            console.log(`oopsie whoopie fucko`);
            console.log(err.errno);
        }
    }

    findAbout(website){

    }
    findAudio($, website, recipient_id, website_id){
        let thisthat = this;
        return new Promise(function(resolve, reject){
            let media = new Media("",recipient_id,"","", "", "", website, website_id);
            console.log("Scraping : " + website);
            $("source").each((i, elem)=>{
                let media = new Media()
                console.log("Website Source is: " + website + " | Link is: " + $(elem).attr("src"));
            });
            $("video").each((i, elem)=>{
                console.log("Website Video is: " + website + " | Link is: " + $(elem).attr("src"));
            });
            $("audio").each((i, elem)=>{
                console.log("Website Audio is: " + website + " | Link is: " + $(elem).attr("src"));
            });
            $("a[href*='/youtu.be/'],"+
              "a[href*='/youtube.com\\/embed/'],"+ 
              "a[href*='/youtube.com\\/watch']"  ).each((i, elem)=>{
                console.log("Website href is " + website + " | Youtube is: " + $(elem).attr("href"));
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

            //Remove all null objects from Array
            links = links.filter(function(item, idk){
                return item != null;
            });

            /*
            For Links that do not begin with the website's url, try to combine it the best you can.
            assume current site is https://google.com/some/page/
            if the link is about.html then convert to https://google.com/some/page/about.html
            if the link is /about then convert to https://google.com/about
             */
            for(let i =0 ;i< links.length-1; i++){
                if(!links[i].includes(".com") && 
                   !links[i].includes(".org") && 
                   !links[i].includes(".net") && 
                   !links[i].includes(".gov") && 
                   !links[i].includes(".jpg") &&
                   !links[i].includes(".pdf") &&
                   !links[i].includes(":") &&
                   !links[i].includes("#")){
                    if(links[i].substr(0,1)=="/"){
                        links[i] = orig.slice(0,-1)+links[i];
                    }else if(current_site.substr(-1) != "/" && links[i].substr(0)!="/"){
                        links[i] = current_site+"/"+links[i];
                    }else{
                        links[i] = current_site+links[i];
                    }
                }
            }
            //Filter out static pages / same pages with locator
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
    //Pause program for amount of milliseconds.
    delay(ms){
        return new Promise(resolve=>setTimeout(resolve, ms));
    }
}
module.exports = webscraper;