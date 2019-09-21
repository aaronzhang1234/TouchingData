const axios = require("axios");
const cheerio = require("cheerio");

const website =  "https://webscraper.io/test-sites/e-commerce/allinone";
axios.get(website).then(response=>{
//    console.log(response.data)
    const $ = cheerio.load(response.data);
    $(".col-sm-4.col-lg-4.col-md-4").each((i, elem)=>{
        console.log($(elem).find("img.img-responsive").attr("src"));
    });
})
.catch(error=>{
    console.log(error);
})
