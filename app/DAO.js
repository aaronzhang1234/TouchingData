/* ****************** DAO ******************
 * 2019 September 22 : Justine Delisi : add insert methods
 * 2019 September 22 : Nathan Reiber  : Created
 ********************************************
 * Purpose : defines a set of data access methods to select from PofG database 
 *
*/

var Company = require('./models/Company.js');
const sqlite3 = require('better-sqlite3');
var Company = require("./models/Company.js");
var Award = require("./models/Award.js");
var Media = require("./models/Media.js");

class Dao {
    //constructor connects to database with file path given
    constructor(dbFilePath){
			 this.db = new sqlite3(dbFilePath,  { verbose: console.log });
    }

	  // returns a company object selected from the name index on PG1_COMPANY
    selectCompanyByName(name) {
      const stmt = this.db.prepare(`SELECT * FROM PG1_COMPANY where name = ? `);

			const select = this.db.transaction((name)=>{
				return  stmt.get(name);
			});
			
			
			const row = select(name);
			console.log(row)

			const comp = new Company(row.id, row.name, row.addr1, row.addr2, row.city, row.state, row.zip, row.congressionalDistrict)
			return comp
		}
	

	  // returns a company object selected from the id index on PG1_COMPANY
    selectCompanyById(id) {
      this.db.prepare(`SELECT * FROM PG1_COMPANY where id = ? `);

			const select = this.db.transaction((id)=>{
				return stmt.get(id)
			});

			const row = select(id);
			const comp = new Company(row.id, row.name, row.addr1, row.addr2, row.city, row.state, row.zip, row.district)
			return  comp
		}
	
		//insert into PG1_COMPANY table
    pg1_CompanyInsert(comp) {
      const stmt = this.db.prepare(`INSERT INTO pg1_company (name, addr1, addr2, city,
            state, zip, congressionalDistrict) VALUES(@name, @addr1, @addr2, @city, @state, @zip, @congressionalDistrict)`);
			
			const insert =  this.db.transaction((comp)=> {
				stmt.run(comp)
			});

			insert(comp);

    }

    //insert into PG1_Media table
    pg1_MediaInsert(media) {
		 const stmt = this.db.prepare(`INSERT INTO pg1_media (filePath, fileType, description, medLength, source, compId) 
				VALUES(@filePath, @fileType, @description, @medLength, @source, @compId)`);

			const insert = this.db.transaction((comp)=> {
				stmt.run(media)
			});

			insert(media);
    }

    //insert into PG1_Award table
    pg1_AwardInsert(award ) {
			const stmt = this.db.prepare(`INSERT INTO pg1_award (piid, compId, currentTotal, potentialTotal, parentAwardAgency, awardingAgency, awardingOffice, fundingOffice, fiscalYear) 
				VALUES(@piid, @compId, @currentTotal, @potentialTotal, @parentAwardAgency, @awardingAgency, @awardingOffice, @fundingOffice, @fiscalYear)`);

			const insert = this.db.trasaction((award)=>{
				stmt.run(award);
			});

			insert(award);
    }

    closeDb(){
        this.db.close();
    }

}

module.exports = Dao;
