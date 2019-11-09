const Sql = require('better-sqlite3');

const db = new Sql('../POLITICS_OF_THE_GRID.db')

let rows = db.prepare(`SELECT * FROM PG1_MEDIA GROUP BY SOURCE`).all();

rows.forEach(function(row, i){
	let mediasOfSource = db.prepare(`SELECT * FROM PG1_MEDIA WHERE SOURCE = ? `).all(row.source);
	let rowToKeep = row
	mediasOfSource.forEach(function(media, i){
		if (media.filePath != null && media.filePath != "") {
			let rowToKeep = media
		}
	})
	db.prepare(`DELETE FROM PG1_MEDIA WHERE source = ? AND media_id <> ?`).run(row.source, rowToKeep.media_id);
})
