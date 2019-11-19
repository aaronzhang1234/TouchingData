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
const say = require('say');



class webscraper{
    //Creating a websearch client using an API Key
    constructor(){  
        let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
        this.dao = new DAO(sqlDatabaseName);

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
    getSiteFromName(companyName, bing_api_key){
		let thisThat = this;
        return new Promise(function(resolve, reject){
            //The BingAPI requires a key that can be found at 
            //https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/
            let credentials = new CognitiveServicesCredentials(bing_api_key);
            let webSearchAPIClient = new WebSearchAPIClient(credentials);
            //Calling the BingAPI to search for the company's name. The layout of the JSON can be found on the Design Document.
            webSearchAPIClient.web.search(companyName).then((results)=>{
                //Simply returns the first URL result.
                //Later iterations might change this.
                resolve(results["webPages"]["value"][0]["url"]);
            }).catch((err)=>{
                thisthat.logger.error(err);
            }) 
        });
    }

    /*
    Getting webscraped data from a site
    orig -> Just the website domain and no sublinks.
    website_name -> current site you are on
    links_visited -> a running total of links on the site
    recipient_id -> current recipient id.
    stopTime -> Time in Epoch when the program is supposed to end.
    */
    async getSite(orig, website_name, links_visited, recipient_id, stopTime){
        let thisthat = this;
        //If time has run out then kill the program.
        if(new Date().valueOf() > stopTime){
            return links_visited;
        }
        try{
            let recipient = this.dao.selectRecipientById(recipient_id);
            //Axios is returning back the pure html given from a website. 
            //If a response isn't given within 10 seconds then stop axios and throw an error.
            const response = await axios.get(website_name, {timeout:10000}); 
            //Loading into cheerios allows for easier searching using jQuery syntax.
            const $ = cheerio.load(response.data);           
            //If the function is on it's first iteration.
            if(links_visited.length == 1){
                this.findAbout($, orig, recipient_id).catch(function(err){thisthat.logger.error(err)});
            }
            //await just pauses the execution until a response is recieved.
            await this.findAudio($, website_name, recipient_id);
            const links = await this.findLinks($, orig, website_name, links_visited);
            //Add current links to the overall list of them.
            links_visited = links_visited.concat(links);
            
            //Because "this" doesn't work in promises or timeouts, we create a local variable which has a "this" instance.
            let thisthat = this;
            for(let i = 0; i < links.length-1; i++){
                if(new Date().valueOf() > stopTime){
                    return links_visited;
                }
                //Wait 5 seconds before continuing
                await this.delay(2000);

                //Wait 5 seconds before going onto next website.
                //Webscraper will die on first page if this is not here.
                setTimeout(function(){
                    links_visited = links_visited.concat(thisthat.getSite(orig, links[i], links_visited, recipient_id, stopTime));
                    return links_visited;
                },5000);                
            }
        }catch(err){
            this.logger.error(`${err.message} at ${website_name}`);
            await this.delay(20000);
        }
    }

    /*
    Returns back all links to about pages.
    $ -> Cheerios loaded html
    orig -> Website with just domain, no sublinks
    recipient_id -> Current recipient's id
    */
    async findAbout($, orig, recipient_id){
        let thisthat = this;

        let recipient = this.dao.selectRecipientById(recipient_id);
        let recipient_name = recipient.name;
        recipient_name = this.getParentPath(recipient.name);
        let about_parent_path = path.join("./data/abouts", recipient_name);

        let links = [];
        await $("a").each((i, elem)=>{        
            let href = $(elem).attr("href");
            if(href!=null){
                //full_url where the link leads to while a_text is the text inside an href.
                //<a href="company.html">Our Company</a>
                //full_url = "company.html"
                //a_text = "Our Company"
                let full_url = url.resolve(orig, href);
                let a_text = $(elem).text();            
                //Seeing if the tags include certain keywords
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

        //If there are about files found, then create the parent directory
        if(links.length >= 1){
            await fs.mkdir(about_parent_path, err=>{
                if(err) thisthat.logger.error(err);
            })
        }
        for(let i = 0; i< links.length; i++){   
            //Each file will just have a number name. 1.txt.
            let about_path = path.join(about_parent_path, (i+1).toString() + ".txt");
            thisthat.logger.info(`About Page Link written to ${about_path}`);

            const response = await axios.get(links[i], {timeout:10000}); 
            const $ = cheerio.load(response.data);

            //Take each paragraph and add them in order to a txt file.
            await $("p").each((i, elem)=>{ 
                let paragraph_text = $(elem).text();
                paragraph_text = paragraph_text.trim(); //Remove excess whitespace from beginning and end.
                //If the text inside a paragraph is longer than 100 characters, then add it to the txt file.
                if(paragraph_text.length > 100){
                    fs.writeFile(about_path, paragraph_text + '\n', {flag: 'a+'}, function(err){
                        if(err) thisthat.logger.error(err);
                    })
                }
            })

            let media = new Media(null,recipient_id,about_path,"txt",null,links[i],recipient.website,null,null,"text");
            thisthat.dao.insertMedia(media);

            await this.delay(2000);
        }
    }

    /*
    Finds Video, Audio, and Youtube videos on a site and adds them to a database
    $ -> Cheerios loaded HTML data
    website -> website URL you are currently scraping
    recipient_id -> Current recipient id
    */
    findAudio($, website, recipient_id){
        let thisthat = this;
        return new Promise(function(resolve, reject){
           let recipient = thisthat.dao.selectRecipientById(recipient_id);
           thisthat.logger.info(`Scraping : ${website}`);
           //Find all source tags and add them to the database
           $("source").each((i, elem)=>{
                let src = $(elem).attr("src");
                if(src){
                    thisthat.logger.info(`Website Source is: ${website} | Link is: ${src}`);
                    let file_type = src.split(".").pop();
                    let media = new Media(null,recipient_id,null,file_type,null, url.resolve(website, src), recipient.website, null, null);
                    thisthat.dao.insertMedia(media);
                }
            });
            //Find all youtube videos and add them to the database
            $("a[href*='/youtu.be/'],"+
              "a[href*='/youtube.com\\/embed/'],"+ 
              "a[href*='/youtube.com\\/watch/']"  ).each((i, elem)=>{
                let src = $(elem).attr("href");
                thisthat.logger.info(`Website href is ${website} | Youtube is: ${src}`);
                let media = new Media(null,recipient_id,null,"mp4",null,src,recipient.website,null,"youtube");
                thisthat.dao.insertMedia(media);
            });
            resolve("");
        });
    }

    /*
    Download a media file.
    parent_directory -> path to the directory where the media will be saved. IE: data/scraped/RECIPIENT_NAME 
    full_url -> Path to the media file on the company's website
    media_id -> SQL ID of the current Media file
    */
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

    /*
    Download a youtube file 
    parent_directory -> path to the directory where the media will be saved. IE: data/scraped/RECIPIENT_NAME 
    youtube_link -> URL of the youtube video
    media_id -> SQL ID of the current Media file
    */
    downloadYoutube(parent_directory, youtube_link, media_id){
			let DOWNLOAD_DIR =  "./data/scraped";
			var ytid = url.parse(youtube_link).pathname.split('/').pop();
			if (ytid === null){return}
			if (!youtube_link.includes("http")){
				youtube_link = "https:"+youtube_link
			}
			let full_download_path = path.join(DOWNLOAD_DIR, parent_directory, ytid+".mp4");
			if (!fs.existsSync(path.join(DOWNLOAD_DIR,parent_directory))){
					fs.mkdirSync(path.join(DOWNLOAD_DIR,parent_directory));
			}
			try{
				this.dao.updateMediaPath(full_download_path, media_id);
				new Promise((resolve)=> {
					youtubedl(youtube_link)
						.on('progress',(length,downloaded, totallength)=> {
							const progress = (downloaded/totallength) * 100;
						})
						.pipe(fs.createWriteStream(full_download_path))
						.on('finish',()=> {
							resolve();
						})
						.on('error',()=>{
							resolve();
						})
				});
				
			}catch(err){
				console.log(err);
			}
    }

    /*
    Returns all links found on the website.
    $-> Cheerio loaded HTML data
    orig -> Website domain without sublinks
    current_site -> site you are currently scraping
    links_visited -> All previous links that were found on other website to prevent repeats
    */
    findLinks($, orig, current_site, links_visited){
        let thisthat = this;
        return new Promise(function(resolve, reject){
            //Find every link on the webpage and add it to an array.
            let links = [];
            $("a").each((i, elem)=>{        
                let href = $(elem).attr("href");
                if(href!=null){
                    //If the link is a partial link then append to it to the current site.
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
            
    /*
    Because cannot read certain folders, remove all spaces, commas, and periods from a recipient's name
    name -> The recipient's name.
    */
	getParentPath(name){
		name = name.replace(/ /g, "_");
		name = name.replace(/\./g, "");
		return name.replace(/,/g, "");
    }
    async convertTextToAudio(parent_directory, textFilePath, websiteId, textId, recipientId){
        let thisthat = this;
        let DOWNLOAD_DIR =  "./data/scraped";
        let fileName = path.basename(textFilePath, '.txt') + '.wav';
        let parent_path = path.join(DOWNLOAD_DIR, parent_directory);
        let full_download_path = path.join(parent_path, fileName);
        if (!fs.existsSync(path.join(DOWNLOAD_DIR,parent_directory))){
            fs.mkdirSync(path.join(DOWNLOAD_DIR,parent_directory));
        }
        return new Promise(function(resolve, reject){
            if(fs.existsSync(textFilePath)){
                console.log(textFilePath);
                fs.readFile(textFilePath, "utf-8", function(err, data){
                    if(err) throw err;
                    say.export(data, 'Alex', 1, full_download_path, (err) => {
                        if (err) {
                            console.error(err)
                        }
                        let media = new Media(null,recipientId,full_download_path,'wav',null, textFilePath, websiteId, textId, null, 'audio');
                        thisthat.dao.insertMedia(media);                   
                        console.log('Text has been saved to ' + full_download_path);
                        resolve("Finished!");
                    })
                })
            }else{
                resolve("resolved");
            }
        })
    }
}
module.exports = webscraper;
