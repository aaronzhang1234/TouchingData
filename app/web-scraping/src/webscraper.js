const axios = require("axios");
const cheerio = require("cheerio");
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');

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
    getSite(orig, website_name, links_visited){
        console.log(links_visited.length);
        axios.get(website_name).then(response=>{
            const $ = cheerio.load(response.data);
            let thisthat = this;
            thisthat.findAudio($, website_name).then(function(){
                let links = thisthat.findLinks($, orig, links_visited).then(function(links){
                    links_visited.push(links);
                    for(let i = 0; i< links.length-1; i++){
                        setTimeout(function(){
                            thisthat.getSite(orig, links[i], links_visited);
                        },5000);
                    }
                });
            });
        })
        .catch(error=>{
            //console.log(error);
        })
    }
    findAudio($, website){
        return new Promise(function(resolve, reject){
            $("source").each((i, elem)=>{
                console.log("Website Source is: " + website + " | Link is: " + $(elem).attr("src"));
            });
            $("video").each((i, elem)=>{
                console.log("Website Video is: " + website + " | Link is: " + $(elem).attr("src"));
            });
            $("audio").each((i, elem)=>{
                console.log("Website Audio is: " + website + " | Link is: " + $(elem).attr("src"));
            })
            resolve("");
        });
    }
    findLinks($, orig, links_visited){
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
            links = links.filter(function(item, idk){
                return item.startsWith(orig);
            });
            links = links.filter(function(item, idk){
                return !links_visited.includes(item);
            });
            resolve(links);
        })
    }
}
module.exports = webscraper;