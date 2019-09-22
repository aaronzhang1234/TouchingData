const axios = require("axios");
const cheerio = require("cheerio");
const webscraperjs = require("./webscraper.js");

var webscraper = new webscraperjs();
webscraper.getSite("http://aaronzhang.xyz");