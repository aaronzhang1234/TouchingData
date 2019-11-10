const Sql = require('better-sqlite3');

const db = new Sql('../POLITICS_OF_THE_GRID.db')
const url = require("url");


db.prepare(`ALTER TABLE PG1_MEDIA RENAME TO 'tempMedia'`).run()

db.prepare(
	"CREATE TABLE IF NOT EXISTS `PG1_MEDIA`("+
	"media_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
	"recipient_id INTEGER NULL,"+
	"filePath TEXT NULL,"+
	"fileType TEXT NOT NULL,"+
	"description TEXT,"+
	"url TEXT NOT NULL UNIQUE,"+ 
	"website_id integer NULL,"+
	"parentKey integer NULL,"+
	"usable integer NULL,"+ //boolean 
	"kind TEXT NULL,"+
	"FOREIGN KEY(recipient_id) REFERENCES PG1_RECIPIENT(recipient_id),"+ "FOREIGN KEY(website_id) REFERENCES PG1_WEBSITE(website_id));").run();

db.prepare(
	"CREATE INDEX IF NOT EXISTS idx_media_recipient_id_2 "+
	"ON PG1_MEDIA(recipient_id);"
).run();

db.prepare(
	"CREATE INDEX IF NOT EXISTS idx_url "+
	"ON PG1_MEDIA(url);"
).run();

db.prepare(
	"CREATE INDEX IF NOT EXISTS idx_media_website "+
	"ON PG1_MEDIA(website_id);"
).run();


let rows = db.prepare(`SELECT * FROM tempMedia`).all();


rows.forEach(function(row, i){
	let kind = video;
	let type = row.fileType;
	if (row.fileType = "youTube"){
		let kind = "youtube"
		let type = "mp4"
	}
	db.prepare(
		`INSERT INTO PG1_MEDIA (
			recipient_id,
			filePath,
			fileType,
			description,
			url,
			website_id,
			kind
		) VALUES(?,?,?,?,?,?,?)`
	).run(
		row.recipient_id,
		row.filePath,
		type,
		row.description,
		url.resolve(row.url, row.source),
		row.website_id,
		kind	
	)	
})

db.prepare(`DROP TABLE IF EXISTS tempMedia`)
