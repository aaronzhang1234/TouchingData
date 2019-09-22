const axios = require("axios");
const cheerio = require("cheerio");

class webscraper{
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