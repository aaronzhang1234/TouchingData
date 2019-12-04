const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const WebSearchAPIClient = require('azure-cognitiveservices-websearch');

let bing_api_key = "502360db0e564d8eb338b5e985ade3b4";
let serach_word = "burritos"

let credentials = new CognitiveServicesCredentials(bing_api_key);
let webSearchAPIClient = new WebSearchAPIClient(credentials);

webSearchAPIClient.web.search(serach_word).then((results)=>{
    console.log(results["webPages"]["value"][0]["url"]);
})
