const Scraper = require('../app/web-scraping/src/webscraper.js');
const Db = require('better-sqlite3');
const DAO	= require('../app/DAO.js');
let db = new Db('data/POLITICS_OF_THE_GRID.db');
let dao = new DAO('data/POLITICS_OF_THE_GRID.db');
const EventEmitter = require('events');

describe('websraper', function(){
	describe('#downloadYoutube()', function(){
		let scraper = new Scraper("458f7fc0ea5c44d38e45178c62515c7b");
		let medias = db.prepare(`SELECT * FROM PG1_MEDIA where fileType = "youtube" group by source`).all();
		let time = 1000;
		medias.forEach(function(media){

			let recipient = dao.selectRecipientById(media.recipient_id);
			try{
				let name = scraper.getParentPath(recipient.name);
				time = time + 2000;
				setTimeout(function(){
					scraper.downloadYoutube(name,media.source, media.media_id);
				}, time);
			}catch (err){
				console.log(media.id)
				console.log(err);
			}
		});

	});
});

