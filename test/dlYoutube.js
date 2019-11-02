const Scraper = require('../app/web-scraping/src/webscraper.js')
const Db = require('better-sqlite3')
let db = new Db('../data/POLITICS_OF_THE_GRID.db')

describe('websraper', function(){
	describe('#downloadYoutube()', function(){
		let scraper = new Scraper()
		const stmt = this.db.prepare(`SELECT * FROM PG1_MEDIA where fileType = "youtube"`);
		var medias = []
	});
});
