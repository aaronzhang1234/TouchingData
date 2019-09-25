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
                console.log(results["webPages"]["value"][i]["url"]);
            }
            //console.log(results["webPages"]["value"]);
        }).catch((err)=>{
            console.log(err)
        })
    }
    //Getting webscraped data from a site
    getSite(website_name){
        axios.get(website_name).then(response=>{
            const $ = cheerio.load(response.data);
            $(".col-sm-4.col-lg-4.col-md-4").each((i, elem)=>{
                console.log($(elem).find("img.img-responsive").attr("src"));
            });
        })
        .catch(error=>{
            console.log(error);
        })
    }
}
module.exports = webscraper;