/* ****************** DAO ******************
 * 2019 September 25 : Nathan Reiber  : DATABASE v2
 * 2019 September 25 : Nathan Reiber  : import better-sqlite3
 *	    							  : rewrite select and insert methods to use synchronous sqlite3 api
 * 2019 September 22 : Justin Delisi  : add insert methods
 * 2019 September 22 : Nathan Reiber  : Created
 ********************************************
 * Purpose : defines a set of data access methods to select from PofG database 
 *
*/

const sqlite3 = require('better-sqlite3');
var Recipient = require("./models/Recipient.js");
var Award = require("./models/Award.js");
var Media = require("./models/Media.js");
var Place = require(".models/PlaceOfPerformance.js");

class Dao {
    //constructor connects to database with file path given
    constructor(dbFilePath){
			 this.db = new sqlite3(dbFilePath,  { verbose: console.log });
    }


	// returns a company object selected from the name index on PG1_RECPIPIENT
    selectRecipientByName(name) {
      const stmt = this.db.prepare(`SELECT * FROM PG1_RECIPIENT where recipient_name = ? `);
			const select = this.db.transaction((name)=>{
				return  stmt.get(name);
			});
			
			const row = select(name);
			let comp = new Recipient();
			
			if (row){
				recipient = new Recipient(
					row.recipient_id, 
					row.recipient_name, 
					row.recipient_address_line_1, 
					row.recipient_address_line_2, 
					row.recipient_city, 
					row.recipient_state_code, 
					row.recipient_zip_4_code, 
					row.recipient_parent_id,
					row.recipient_district_id, 
					row.recipient_website_id
					row.place_of_performance_id,
				)
			}
			return recipient;
		}
	

	//returns a recipient object selected from the id index on PG1_RECIPIENT
	selectRecipientById(id) {
		this.db.prepare(`SELECT * FROM PG1_RECIPIENT where id = ? `);

		const select = this.db.transaction((id)=>{
			return stmt.get(id)
		});

		const row = select(id);

		let comp = new Recipient();
		
		if (row){
			recipient = new Recipient(
				row.recipient_id, 
				row.recipient_name, 
				row.recipient_address_line_1, 
				row.recipient_address_line_2, 
				row.recipient_city, 
				row.recipient_state_code, 
				row.recipient_zip_4_code, 
				row.recipient_parent_id,
				row.recipient_district_id, 
				row.recipient_website_id
				row.place_of_performance_id,
			)
		}

		return  recipient;
	}
	
	
	//insert a record into PG1_RECIPIENT table, returns nothing, will throw any exception
    insertRecipient(recipient) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_RECIPIENT (
				recipient_name, 
				recipient_address_line_1, 
				recipient_address_line_2, 
				recpient_city, 
				recipient_state_code, 
				recipient_zip_4_code, 
				recipient_parent_id,
				recipient_district_id,
				recipient_website_id,
				recipient_place_of_performance_id,
			) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
		);
			

		const insert =  this.db.transaction((recipient)=> {
			try{
				stmt.run(
					recipient.name, 
					recipient.addr1, 
					recipient.addr2, 
					recipient.city, 
					recipient.state, 
					recipient.zip, 
					recipient.parent, 
					recipient.congressionalDistrict
					recipient.website, 
					recipient.placeOfPerformance, 
				)
			}catch(err){
				if(!this.db.inTransaction) throw err;
			}
		});

		insert(recipient);
    }
	

    //insert into PG1_Media table
    insertMedia(media) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_MEDIA (
				filePath, 
				fileType, 
				description, 
				source, 
				url,
				website_id
				recipient_id
			) VALUES(?, ?, ?, ?, ?, ?, ?)`
		);

		const insert = this.db.transaction((media)=> {

			try{
				stmt.run(
					media.filePath, 
					media.fileType, 
					media.description, 
					media.medLength, 
					media.source, 
					media.website,
					media.recpient
				)
			}catch(err){
				if(!this.db.inTransaction) throw err;
			}

		});

		insert(media);
    }

    //insert into PG1_Award table
    insertAward(award ) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_AWARD (
				award_id_piid, 
				fiscal_year,
				recipient_id, 
				current_total_value_of_award, 
				potential_total_value_of_award, 
				awarding_agency_id, 
				awarding_office_id, 
				funding_office_id
			) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`
		);

		const insert = this.db.transaction((award)=>{
			try{
				stmt.run(
					award.piid, 
					award.fiscalYear,
					award.recipient, 
					award.currentTotal, 
					award.potentialTotal, 
					award.awardingAgency, 
					award.awardingOffice, 
					award.fundingOffice 
				);
			}catch(err){
				if(!this.db.inTransaction) throw err;
			}
		});

		insert(award);
    }

    //insert into PG1_PLACE_OF_PERFORMANCE table
    insertAward(place) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_AWARD (
				place_of_perforamcne_id, 
				fiscal_year,
				recipient_id, 
				current_total_value_of_award, 
				potential_total_value_of_award, 
				awarding_agency_id, 
				awarding_office_id, 
				funding_office_id
			) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`
		);

		const insert = this.db.transaction((award)=>{
			try{
				stmt.run(
					award.piid, 
					award.fiscalYear,
					award.recipient, 
					award.currentTotal, 
					award.potentialTotal, 
					award.awardingAgency, 
					award.awardingOffice, 
					award.fundingOffice 
				);
			}catch(err){
				if(!this.db.inTransaction) throw err;
			}
		});

		insert(award);
    }
    closeDb(){
        this.db.close();
    }

}

module.exports = Dao;
