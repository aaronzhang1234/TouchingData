/* ****************** DAO ******************
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
var ParentAward = require("./models/ParentAwardAgency.js");
var AwardingAgency = require("./models/AwardingAgency.js");
var Website = require("./models/Website.js");
var Office = require("./models/Office.js");
var OwnershipType = require("./models/OwnershipType.js");
var RecOwnership = require("./models/RecipientOwnershipType.js");

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
				row.recipient_website_id,
				row.place_of_performance_id
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
				console.log("yay");

			}catch(err){
				console.log(err);
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
				if(!this.db.inTransaction) throw err;
			}

		});

		insert(media);
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
				if(!this.db.inTransaction) throw err;
			}
		});

		insert(award);
    }

    //insert into PG1_PLACE_OF_PERFORMANCE table
    insertPlace(place) {
		const stmt = this.db.prepare(
			`INSERT INTO PG1_PLACE_OF_PERFORMANCE (
        place_of_performance_id,
        place_of_performance_city,
        place_of_performance_county,
        place_of_performance_zip,
        place_of_performance_state_code,
        place_of_performance_district_id
			) VALUES(?, ?, ?, ?, ?, ?)`
		);

		const insert = this.db.transaction((place)=>{
			try{
				stmt.run(
          place.id,
          place.city,
          place.couty,
          place.zip,
          place.state,
          place.congressionalDistrict
				);
			}catch(err){
				if(!this.db.inTransaction) throw err;
			}
		});

		insert(place);
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
          if(!this.db.inTransaction) throw err;
        }
      });
  
      insert(state);
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
				if(!this.db.inTransaction) throw err;
			}
		});

		insert(parent);
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
          if(!this.db.inTransaction) throw err;
        }
      });
  
      insert(district);
      }

    //insert into PG1_AWARDING_AGENCY table
    insertAwardingAgency(agency) {
      const stmt = this.db.prepare(
        `INSERT INTO PG1_AWARDING_AGENCY (
          awarding_agency_id,
          awarding_agency_name,
          parent_award_agency_id
        ) VALUES(?, ?, ?)`
      );
  
      const insert = this.db.transaction((agency)=>{
        try{
          stmt.run(
            agency.id,
            agency.name,
            agency.parent
          );
        }catch(err){
          if(!this.db.inTransaction) throw err;
        }
      });
  
      insert(agency);
      }

    //insert into PG1_PARENT_AWARD_AGENCY table
    insertParentAward(agency) {
      const stmt = this.db.prepare(
        `INSERT INTO PG1_PARENT_AWARD_AGENCY (
          parent_award_agency_id,
          parent_awarding_agency_name
        ) VALUES(?, ?)`
      );
  
      const insert = this.db.transaction((agency)=>{
        try{
          stmt.run(
            agency.id,
            agency.name
          );
        }catch(err){
			console.log(err);
          if(!this.db.inTransaction) throw err;
        }
      });
  
      insert(agency);
      }

    //insert into PG1_WEBSITE table
    insertWebsite(website) {
      const stmt = this.db.prepare(
        `INSERT INTO PG1_WEBSITE (
          website_id,
          website_domain
        ) VALUES(?, ?)`
      );
  
      const insert = this.db.transaction((website)=>{
        try{
          stmt.run(
            website.id,
            website.domain
          );
        }catch(err){
          if(!this.db.inTransaction) throw err;
        }
      });
  
      insert(website);
      }


    //insert into PG1_OFFICE table
	insertOffice(office) {
      const stmt = this.db.prepare(
        `INSERT INTO PG1_OFFICE (
          office_id,
          office_name
        ) VALUES(?, ?)`
      );
  
      const insert = this.db.transaction((office)=>{
        try{
          stmt.run(
            office.id,
            office.name
          );
        }catch(err){
          if(!this.db.inTransaction) throw err;
        }
      });
  
      insert(office);
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
          if(!this.db.inTransaction) throw err;
        }
      });
  
      insert(ownershipType);
      }

    //insert into PG1_RECIPIENCT_OWNERSHIP_TYPE table
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
          if(!this.db.inTransaction) throw err;
        }
      });
  
      insert(recOwnership);
      }

    closeDb(){
        this.db.close();
    }

}

module.exports = Dao;
