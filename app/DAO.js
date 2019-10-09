/* ****************** DAO ******************
 * 2019 October   07 : Nathan Reiber  : select all recipients
 * 2019 October   03 : Hadi Haidar    : Select Statements
 * 2019 October   02 : Nathan Reiber  : revise naming conventions for consistency
 * 									  : removed methods for deprecated tables
 * 2019 September 29 : Hadi Haidar    : add insert methods
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


//include all models
var Recipient = require("./models/Recipient.js");
var Award = require("./models/Award.js");
var Media = require("./models/Media.js");
var Place = require("./models/PlaceOfPerformance.js");
var state = require("./models/State.js");
var RecParent = require("./models/RecipientParent.js");
var District = require("./models/District.js");
var ParentAwardingAgency = require("./models/ParentAwardAgency.js");
var AwardingAgency = require("./models/AwardingAgency.js");
var PlaceOfPerformance = require("./models/PlaceOfPerformance.js");
var Website = require("./models/Website.js");
var Office = require("./models/Office.js");
var OwnershipType = require("./models/OwnershipType.js");
var RecOwnership = require("./models/RecipientOwnershipType.js");

class Dao {
	//constructor connects to database with file path given
	constructor(dbFilePath){
		this.db = new sqlite3(dbFilePath);//,  { verbose: console.log });
	}

	// selects all recipients from PG1_RECIPIENT
	selectAllRecipients(){
		let rows = this.db.prepare(`SELECT * FROM PG1_RECIPIENT`).all();
		var recipients = [];
		rows.forEach(function(row, i){
			let recipient = new Recipient(
				row.recipient_id, 
				row.recipient_name, 
				row.recipient_address_line_1, 
				row.recipient_address_line_2, 
				row.recipient_city, 
				row.recipient_state_code, 
				row.recipient_zip_4_code, 
				row.recipient_parent_id,
				row.recipient_district_id, 
				row.recipient_website_id,
				row.place_of_performance_id
			)
			recipients.push(recipient);
		});
		//console.log(recipients);
		return recipients;
	}

	// returns a company object selected from the name index on PG1_RECPIPIENT
	selectRecipientByName(name) {
		const stmt = this.db.prepare(`SELECT * FROM PG1_RECIPIENT where recipient_name = ? `);
		const select = this.db.transaction((name)=>{
			return  stmt.get(name);
		});

		const row = select(name);
		let recipient = new Recipient();

		if (row){
			let recipient = new Recipient(
				row.recipient_id, 
				row.recipient_name, 
				row.recipient_address_line_1, 
				row.recipient_address_line_2, 
				row.recipient_city, 
				row.recipient_state_code, 
				row.recipient_zip_4_code, 
				row.recipient_parent_id,
				row.recipient_district_id, 
				row.recipient_website_id,
				row.place_of_performance_id
			)
			return recipient;
		}
		return null;
	}

	//returns an array of arrays,
	//the fields of the inner array are a recipient and that recipient's parent - in that order
	//example output:
	//[
	//	[
	//		{
	//			id: 1106,
	//			name: 'GLOBAL TRAVELER LLC',
	//			addr1: '18283 RIVIERA WAY',
	//			addr2: null,
	//			city: 'LEESBURG',
	//			state: 'VA',
	//			zip: '201767470',
	//			parent: 1296,
	//			congressionalDistrict: 10,
	//			website: null,
	//			placeOfPerformance: null
	//		},
	//		{
	//			id: 1296,
	//			name: 'GLOBAL TRAVELER LLC'
	//		}
	//	],
	//	...
	//]
	selectRecsAndParents(){
		let rows = this.db.prepare(`SELECT * FROM PG1_RECIPIENT r LEFT JOIN PG1_RECIPIENT_PARENT p on p.recipient_parent_id = r.recipient_parent_id`).all();
		//console.log(recipients);
		var records = [];
		rows.forEach(function(row, i){
			let recipient = new Recipient(
				row.recipient_id, 
				row.recipient_name, 
				row.recipient_address_line_1, 
				row.recipient_address_line_2, 
				row.recipient_city, 
				row.recipient_state_code, 
				row.recipient_zip_4_code, 
				row.recipient_parent_id,
				row.recipient_district_id, 
				row.recipient_website_id,
				row.place_of_performance_id
			)
			let parent = new RecParent(
				row.recipient_parent_id,
				row.recipient_parent_name
			)
			records.push([recipient, parent]);
		});

		return records;
	}

	//updates recipient website id 
	updateRecipientWebsite(recId, websiteId){
		try{
			this.db.prepare(`UPDATE PG1_RECIPIENT SET recipient_website_id = ? WHERE recipient_id = ?;`).run(websiteId, recId);
		}catch(err){
			console.log(err);
		}
	}

	//returns a recipient object selected from the id index on PG1_RECIPIENT
	selectRecipientById(id) {
		const stmt = this.db.prepare(`SELECT * FROM PG1_RECIPIENT where recipient_id = ? `);
		const select = this.db.transaction((id)=>{
			return stmt.get(id)
		});

		const row = select(id);

		let recipient = new Recipient();

		if (row){
			let recipient = new Recipient(
				row.recipient_id, 
				row.recipient_name, 
				row.recipient_address_line_1, 
				row.recipient_address_line_2, 
				row.recipient_city, 
				row.recipient_state_code, 
				row.recipient_zip_4_code, 
				row.recipient_parent_id,
				row.recipient_district_id, 
				row.recipient_website_id,
				row.place_of_performance_id
			)
			return  recipient;
		}
		return null;
	}


	//insert a record into PG1_RECIPIENT table, returns nothing, will throw any exception
	insertRecipient(recipient) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_RECIPIENT (
				recipient_name, 
				recipient_address_line_1, 
				recipient_address_line_2, 
				recipient_city, 
				recipient_state_code, 
				recipient_zip_4_code, 
				recipient_parent_id,
				recipient_district_id,
				recipient_website_id,
				recipient_place_of_performance_id
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
					recipient.congressionalDistrict,
					recipient.website, 
					recipient.placeOfPerformance
				);

			}catch(err){
				throw err;
			}
		});

		insert(recipient);
	}

	//returns a recipient object selected from the id index on PG1_Media
	selectMediaById(id) {
		const stmt = this.db.prepare(`SELECT * FROM PG1_Media WHERE media_id = ?;`);
		const select = this.db.transaction((id)=>{
			return stmt.get(id)
		});

		const row = select(id);
		let media = new Media();

		if (row){
			let media = new Media(
				row.media_id, 
				row.recipient_id, 
				row.filePath, 
				row.fileType,
				row.description,
				row.source,
				row.url,
				row.website_id 
			)
			return media;
		}
		return null;
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
				website_id,
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
				throw err;
			}

		});

		insert(media);
	}

	//returns a recipient object selected from the id index on PG1_Award table
	selectAwardId(id,year) {
		const stmt = this.db.prepare(`SELECT * FROM PG1_AWARD 
	WHERE award_id_piid = ? AND fiscal_year = ?`);

		const select = this.db.transaction((id,year)=>{
			return stmt.get(id,year)
		});

		const row = select(id,year);
		let award = new Award();

		if (row){
			let award = new Award(
				row.award_id_piid,
				row.recipient_id,
				row.current_total_value_of_award,
				row.potential_total_value_of_award,
				row.awarding_agency_id,
				row.awarding_office_id,
				row.funding_office_id,
				row.fiscal_year
			)
			return award;
		}
		return null;
	}

	//insert into PG1_Award table
	insertAward(award) {
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
				throw err;
			}
		});

		insert(award);
	}

	//returns a recipient object selected from the id index on PG1_PLACE_OF_PERFORMANCE table
	selectPlacePerformance(city,zip) {
		const stmt = this.db.prepare(`SELECT * FROM PG1_PLACE_OF_PERFORMANCE
	WHERE place_of_performance_city = ? AND place_of_performance_zip = ?`);

		const select = this.db.transaction((city,zip)=>{
			return stmt.get(city,zip)
		});

		const row = select(city,zip);

		let placeOfPerformance = new PlaceOfPerformance();

		if (row){
			let placeOfPerformance = new PlaceOfPerformance(
				row.place_of_performance_id,
				row.place_of_performance_city,
				row.place_of_performance_zip,
				row.place_of_performance_county,
				row.place_of_performance_state_code,
				row.place_of_performance_district_id
			)
			return placeOfPerformance;
		}
		return null;
	}

	//insert into PG1_PLACE_OF_PERFORMANCE table
	insertPlace(place) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_PLACE_OF_PERFORMANCE (
		place_of_performance_city,
		place_of_performance_county,
		place_of_performance_zip,
		place_of_performance_state_code,
		place_of_performance_district_id
			) VALUES(?, ?, ?, ?, ?)`
		);

		const insert = this.db.transaction((place)=>{
			try{
				stmt.run(
					place.city,
					place.county,
					place.zip,
					place.state,
					place.congressionalDistrict
				);
			}catch(err){
				throw err;
			}
		});

		insert(place);
	}

	//returns a recipient object selected from the id index on PG1_STATE table
	selectStateByCode(code) {
		const stmt = this.db.prepare(`SELECT * FROM PG1_STATE WHERE state_code = ?`);
		const select = this.db.transaction((code)=>{
			return stmt.get(code)
		});

		const row = select(code);
		let state = new State();

		if (row){
			let state = new State(
				row.state_code,
				row.state_name
			)
			return state;
		}
		return null;
	}

	//insert into PG1_STATE table
	insertState(state) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_State (
		  state_code,
		  state_name
		) VALUES(?, ?)`
		);

		const insert = this.db.transaction((state)=>{
			try{
				stmt.run(
					state.id,
					state.name
				);
			}catch(err){
				throw err;
			}
		});

		insert(state);
	}


	//returns a recipient object selected from the id index on PG1_RECIPIENT_PARENT table
	selectRecipientParentbyName(name) {
		const stmt = this.db.prepare(`SELECT * FROM PG1_RECIPIENT_PARENT WHERE recipient_parent_name = ?;`);
		const select = this.db.transaction((name)=>{
			return stmt.get(name)
		});

		const row = select(name);
		let recParent = new RecParent();

		if (row){
			let recParent = new RecParent(
				row.recipient_parent_id,
				row.recipient_parent_name
			)
			return recParent;
		}
		return null;
	}


	//insert into PG1_RECIPIENT_PARENT table
	insertRecParent(parent) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_RECIPIENT_PARENT (
		recipient_parent_name
			) VALUES(?)`
		);

		const insert = this.db.transaction((parent)=>{
			try{
				stmt.run(
					parent.name
				);
			}catch(err){
				throw err;
			}
		});

		insert(parent);
	}

	//returns a recipient object selected from the id index on PG1_CONGRESSIONAL_DISTRICT table
	selectCongressDistrict(id,code) {
		const stmt = this.db.prepare(`SELECT * FROM PG1_CONGRESSIONAL_DISTRICT
	WHERE district_id = ? AND state_code = ?`);
		const select = this.db.transaction((id,code)=>{
			return stmt.get(id,code)
		});

		const row = select(id,code);
		let congressDistrict = new CongresDistrict();

		if (row){
			let congressDistrict = new CongresDistrict(
				row.district_id,
				row.state_code
			)
			return congressDistrict;
		}
		return null;
	}

	//insert into PG1_CONGRESSIONAL_DISTRICT table
	insertDistrict(district) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_CONGRESSIONAL_DISTRICT (
		  district_id,
		  state_code
		) VALUES(?, ?)`
		);

		const insert = this.db.transaction((district)=>{
			try{
				stmt.run(
					district.id,
					district.state
				);
			}catch(err){
				throw err;
			}
		});

		insert(district);
	}

	//returns a recipient object selected from the id index on PG1_AWARDING_AGENCY table
	selectAwardingAgency(name) {
		const stmt = this.db.prepare(`SELECT * FROM PG1_AWARDING_AGENCY
	WHERE awarding_agency_name = ?`);
		const select = this.db.transaction((name)=>{
			return stmt.get(name)
		});

		const row = select(name);
		let awardingAgency = new AwardingAgency();

		if (row){
			let awardingAgency = new AwardingAgency(
				row.awarding_agency_id,
				row.awarding_agency_name,
				row.parent_award_agency_id
			)
			return awardingAgency;
		}
		return null;
	}

	//insert into PG1_AWARDING_AGENCY table
	insertAwardingAgency(agency) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_AWARDING_AGENCY (
		  awarding_agency_name,
		  parent_award_agency_id
		) VALUES(?, ?)`
		);

		const insert = this.db.transaction((agency)=>{
			try{
				stmt.run(
					agency.name,
					agency.parent
				);
			}catch(err){
				throw err;
			}
		});

		insert(agency);
	}

	//returns a recipient object selected from the id index on PG1_PARENT_AWARDING_AGENCY table
	selectParentAwardingAgency(name) {
		const stmt = this.db.prepare(`SELECT * FROM PG1_PARENT_AWARD_AGENCY
	WHERE parent_awarding_agency_name = ?`);
		const select = this.db.transaction((name)=>{
			return stmt.get(name)
		});

		const row = select(name);
		let parentAwardingAgency = new ParentAwardingAgency();

		if (row){
			let parentAwardingAgency = new ParentAwardingAgency(
				row.parent_award_agency_id,
				row.parent_awarding_agency_name
			)
			return parentAwardingAgency;
		}
		return null;
	}

	//insert into PG1_PARENT_AWARD_AGENCY table
	insertParentAward(agency) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_PARENT_AWARD_AGENCY (
		  parent_awarding_agency_name
		) VALUES(?)`
		);

		const insert = this.db.transaction((agency)=>{
			try{
				stmt.run(
					agency.name
				);
			}catch(err){
				throw err;
			}
		});

		insert(agency);
	}

	//returns a recipient object selected from the id index on PG1_WEBSITE table
	selectWebsite(domain) {
		const stmt = this.db.prepare(`SELECT * FROM PG1_WEBSITE WHERE website_domain = ?`);
		const select = this.db.transaction((domain)=>{
			return stmt.get(domain)
		});

		const row = select(domain);
		let website = new Website();

		if (row){
			let website = new Website(
				row.website_id,
				row.website_domain
			)
			return website;
		}
		return null;
	}

	//insert into PG1_WEBSITE table
	insertWebsite(website) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_WEBSITE (
		  website_domain
		) VALUES(?)`
		);

		const insert = this.db.transaction((website)=>{
			try{
				stmt.run(
					website.domain
				);
			}catch(err){
				console.log(err);
			}
		});

		insert(website);
	}

	//returns a recipient object selected from the id index on PG1_OFFICE table
	selectOffice(name) {
		const stmt = this.db.prepare(`SELECT * FROM PG1_OFFICE WHERE office_name = ?`);
		const select = this.db.transaction((name)=>{
			return stmt.get(name)
		});

		const row = select(name);
		let office = new Office();

		if (row){
			let office = new Office(
				row.office_id,
				row.office_name
			)
			return office;
		}
		return null;
	}

	//insert into PG1_OFFICE table
	insertOffice(office) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_OFFICE (
		  office_name
		) VALUES(?)`
		);

		const insert = this.db.transaction((office)=>{
			try{
				stmt.run(
					office.name
				);
			}catch(err){
				throw err;
			}
		});

		insert(office);
	}


	//returns a recipient object selected from the id index on PG1_OWNERSHIP_TYPE table
	selectOwnershipType(id) {
		const stmt = this.db.prepare(`SELECT * FROM PG1_OWNERSHIP_TYPE
	WHERE ownership_type_id = ?`);
		const select = this.db.transaction((id)=>{
			return stmt.get(id)
		});

		const row = select(id);
		let ownershipType = new OwnershipType();

		if (row){
			let ownershipType = new OwnershipType(
				row.ownership_type_id,
				row.ownership_type_description
			)
			return ownershipType;
		}
		return null;
	}

	//insert into PG1_OWNERSHIP_TYPE table
	insertOwnershipType(ownershipType) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_OWNERSHIP_TYPE (
		  ownership_type_id,
		  ownership_type_description
		) VALUES(?, ?)`
		);

		const insert = this.db.transaction((ownershipType)=>{
			try{
				stmt.run(
					ownershipType.id,
					ownershipType.description
				);
			}catch(err){
				throw err;
			}
		});

		insert(ownershipType);
	}


	//returns a recipient object selected from the id index on PG1_RECIPIENT_OWNERSHIP_TYPE table
	selectRecOwnerType(type_id,rec_id) {
		const stmt = this.db.prepare(`SELECT * FROM PG1_RECIPIENT_OWNERSHIP_TYPE
	WHERE ownership_type_id = ? AND recipient_id = ?`);
		const select = this.db.transaction((type_id,rec_id)=>{
			return stmt.get(type_id,rec_id)
		});

		const row = select(type_id,rec_id);
		let recOwnership = new RecOwnership();

		if (row){
			let recOwnership = new RecOwnership(
				row.ownership_type_id,
				row.recipient_id,
				row.recipient_ownership_notes
			)
			return recOwnership;
		}
		return null;
	}

	//insert into PG1_RECIPIENT_OWNERSHIP_TYPE table
	insertRecOwnership(recOwnership) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_RECIPIENT_OWNERSHIP_TYPE (
		  ownership_type_id,
		  recipient_id,
		  recipient_ownership_notes
		) VALUES(?, ?, ?)`
		);

		const insert = this.db.transaction((recOwnership)=>{
			try{
				stmt.run(
					recOwnership.ownershipType,
					recOwnership.recipient,
					recOwnership.notes
				);
			}catch(err){
				throw err;
			}
		});

		insert(recOwnership);
	}

	//create and drop tables

	//WILL CREATE ALL TABLES FOR THE DATABASE if they don't already exist
	createAllTables(){
		this.createOwnTypeTable();
		this.createStateTable();
		this.createDistrictTable();
		this.createPOPTable();
		this.createRecParentTable();
		this.createRecipientTable();
		this.createRecOwnTable();
		this.createParentAgencyTable();
		this.createAwardingAgencyTable();
		this.createOfficeTable();
		this.createAwardTable();
		this.createWebsiteTable();
		this.createMediaTable();
	}

	//WILL DROP ALL TABLES FROM THE DATABASE LOSING ALL DATA
	dropAllTables(){
		this.db.prepare("DROP TABLE IF EXISTS `PG1_MEDIA`;").run();

		this.db.prepare("DROP TABLE IF EXISTS PG1_WEBSITE;").run();

		this.db.prepare("DROP TABLE IF EXISTS PG1_AWARD;").run();

		this.db.prepare("DROP TABLE IF EXISTS PG1_OFFICE;").run();

		this.db.prepare("DROP TABLE IF EXISTS PG1_AWARDING_AGENCY;").run();

		this.db.prepare("DROP TABLE IF EXISTS PG1_PARENT_AWARD_AGENCY;").run();

		this.db.prepare("DROP TABLE IF EXISTS PG1_RECIPIENT_OWNERSHIP_TYPE;").run();

		this.db.prepare("DROP TABLE IF EXISTS PG1_RECIPIENT;").run();

		this.db.prepare("DROP TABLE IF EXISTS PG1_RECIPIENT_PARENT;").run();

		this.db.prepare("DROP TABLE IF EXISTS PG1_PLACE_OF_PERFORMANCE;").run();

		this.db.prepare("DROP TABLE IF EXISTS PG1_CONGRESSIONAL_DISTRICT;").run();

		this.db.prepare("DROP TABLE IF EXISTS PG1_STATE;").run();

		this.db.prepare("DROP TABLE IF EXISTS PG1_OWNERSHIP_TYPE;").run();
	}

	createRecipientTable(){
		this.db.prepare(
			"CREATE TABLE IF NOT EXISTS `PG1_RECIPIENT`("+
			"recipient_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
			"recipient_name TEXT NOT NULL UNIQUE,"+
			"recipient_address_line_1 TEXT,"+
			"recipient_address_line_2 TEXT,"+
			"recipient_city TEXT,"+
			"recipient_state_code TEXT NULL,"+
			"recipient_zip_4_code TEXT,"+
			"recipient_parent_id integer,"+
			"recipient_district_id integer,"+
			"recipient_website_id INTEGER NULL,"+
			"recipient_place_of_performance_id INTEGER NULL,"+
			"FOREIGN KEY(recipient_district_id, recipient_state_code) REFERENCES PG1_CONGRESSIONAL_DISTRICT(district_id, state_code)"+
			"FOREIGN KEY(recipient_state_code) REFERENCES PG1_STATE(state_code)"+
			"FOREIGN KEY(recipient_website_id) REFERENCES PG1_WEBSITE(website_id)"+
			"FOREIGN KEY(recipient_place_of_performance_id) REFERENCES PG1_PLACE_OF_PERFORMANCE(place_of_performance_id));"
		).run();
	}

	createMediaTable(){
		this.db.prepare(
			"CREATE TABLE IF NOT EXISTS `PG1_MEDIA`("+
			"media_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
			"recipient_id INTEGER NULL,"+
			"filePath TEXT NOT NULL,"+
			"fileType TEXT NOT NULL,"+
			"description TEXT,"+
			"source TEXT,"+
			"url TEXT,"+
			"website_id integer NULL,"+
			"FOREIGN KEY(recipient_id) REFERENCES PG1_REPIENT(recipient_id),"+
			"FOREIGN KEY(website_id) REFERENCES PG1_WEBSITE(website_id));"
		).run();

		this.db.prepare(
			"CREATE INDEX idx_media_recipient_id "+
			"ON PG1_MEDIA(recipient_id);"
		).run();
	}

	// this method will also create 3 indexes on this table
	createAwardTable(){
		this.db.prepare(
			"CREATE TABLE IF NOT EXISTS `PG1_AWARD`("+
			"award_id_piid INTEGER NOT NULL,"+
			"recipient_id INTEGER,"+
			"current_total_value_of_award REAL,"+
			"potential_total_value_of_award REAL,"+
			"awarding_agency_id integer NULL,"+
			"awarding_office_id integer NULL,"+
			"funding_office_id TEXT NULL,"+
			"fiscal_year TEXT,"+
			"FOREIGN KEY(recipient_id) REFERENCES PG1_RECIPIENT(recipient_id),"+
			"FOREIGN KEY(awarding_office_id) REFERENCES PG1_OFFICE(office_id),"+
			"FOREIGN KEY(funding_office_id) REFERENCES PG1_OFFICE(office_id),"+
			"FOREIGN KEY(awarding_agency_id) REFERENCES PG1_AWARDING_AGENCY(awarding_agency_id),"+
			"PRIMARY KEY(award_id_piid,fiscal_year));"
		).run();

		this.db.prepare(
			"CREATE INDEX idx_award_id "+
			"ON PG1_AWARD(award_id_piid, fiscal_year);"
		).run();

		this.db.prepare(
			"CREATE INDEX idx_award_piid "+
			"ON PG1_AWARD(award_id_piid);"
		).run();

		this.db.prepare(
			"CREATE INDEX idx_award_recipient_id "+
			"ON PG1_AWARD(recipient_id);"
		).run();

	}

	createPOPTable(){
		this.db.prepare(
			"CREATE TABLE IF NOT EXISTS `PG1_PLACE_OF_PERFORMANCE`("+
			"place_of_performance_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
			"place_of_performance_city TEXT,"+
			"place_of_performance_zip TEXT,"+
			"place_of_performance_county TEXT,"+
			"place_of_performance_state_code TEXT NULL,"+
			"place_of_performance_district_id TEXT NULL,"+
			"UNIQUE(place_of_performance_city, place_of_performance_zip),"+
			"FOREIGN KEY(place_of_performance_district_id, place_of_performance_state_code) REFERENCES PG1_CONGRESSIONAL_DISTRICT(district_id, state_code));"
		).run();
	}

	createAwardingAgencyTable(){
		this.db.prepare(
			"CREATE TABLE IF NOT EXISTS `PG1_AWARDING_AGENCY`("+
			"awarding_agency_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
			"awarding_agency_name TEXT,"+
			"parent_award_agency_id INTEGER NULL,"+
			"UNIQUE(awarding_agency_name, parent_award_agency_id),"+
			"FOREIGN KEY(parent_award_agency_id) REFERENCES PG1_PARENT_AWARD_AGENCY(parent_award_agency_id));"
		).run();
	}

	createParentAgencyTable(){
		this.db.prepare(
			"CREATE TABLE IF NOT EXISTS `PG1_PARENT_AWARD_AGENCY`("+
			"parent_award_agency_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
			"parent_awarding_agency_name integer UNIQUE);"
		).run();
	}

	createOfficeTable(){
		this.db.prepare(
			"CREATE TABLE IF NOT EXISTS `PG1_OFFICE`("+
			"office_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
			"office_name TEXT UNIQUE);"
		).run();
	}

	createStateTable(){
		this.db.prepare(
			"CREATE TABLE IF NOT EXISTS `PG1_STATE`("+
			"state_code TEXT NOT NULL PRIMARY KEY,"+
			"state_name TEXT);"
		).run();
	}

	createDistrictTable(){
		this.db.prepare(
			"CREATE TABLE IF NOT EXISTS `PG1_CONGRESSIONAL_DISTRICT`("+
			"district_id INTEGER NOT NULL,"+
			"state_code INTEGER,"+
			"PRIMARY KEY(district_id,state_code));"
		).run();
	}

	createWebsiteTable(){
		this.db.prepare(
			"CREATE TABLE IF NOT EXISTS `PG1_WEBSITE`("+
			"website_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,"+
			"website_domain TEXT UNIQUE);"
		).run();
	}

	createRecOwnTable(){
		this.db.prepare(
			"CREATE TABLE IF NOT EXISTS `PG1_RECIPIENT_OWNERSHIP_TYPE`("+
			"ownership_type_id TEXT NOT NULL,"+
			"recipient_id INTEGER NOT NULL,"+
			"recipient_ownership_notes TEXT,"+
			"PRIMARY KEY(ownership_type_id,recipient_id)"+
			"FOREIGN KEY(recipient_id) REFERENCES PG1_RECIPIENT(recipient_id)"+
			"FOREIGN KEY(ownership_type_id) REFERENCES PG1_OWNERSHIP_TYPE(ownership_type_id));"
		).run();
	}

	createOwnTypeTable(){
		this.db.prepare(
			"CREATE TABLE IF NOT EXISTS `PG1_OWNERSHIP_TYPE`(" +
			"ownership_type_id TEXT NOT NULL PRIMARY KEY,"+
			"ownership_type_description TEXT);"
		).run();
	}

	createRecParentTable(){
		this.db.prepare(
			"CREATE TABLE IF NOT EXISTS `PG1_RECIPIENT_PARENT`(" +
			"recipient_parent_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
			"recipient_parent_name TEXT UNIQUE);"
		).run();
	}

	closeDb(){
		this.db.close();
	}
}

module.exports = Dao;
