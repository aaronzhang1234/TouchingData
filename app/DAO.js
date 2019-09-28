/* ****************** DAO ******************
 * 2019 September 25 : Nathan Reiber  : import better-sqlite3
 * 																		: rewrite select and insert methods to use synchronous sqlite3 api
 * 2019 September 22 : Justin Delisi  : add insert methods
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

			let comp = new Company();
			
			if (row){
				comp = new Company(row.id, row.name, row.addr1, row.addr2, row.city, row.state, row.zip, row.congressionalDistrict)
			}
			return comp
		}
	

	  // returns a company object selected from the id index on PG1_COMPANY
    selectCompanyById(id) {
      this.db.prepare(`SELECT * FROM PG1_COMPANY where id = ? `);

			const select = this.db.transaction((id)=>{
				return stmt.get(id)
			});

			const row = select(id);

			let comp = new Company();
		
			if (row){
				comp = new Company(row.id, row.name, row.addr1, row.addr2, row.city, row.state, row.zip, row.district)
			}

			return  comp;
		}
	
		//insert into PG1_COMPANY table
    pg1_CompanyInsert(comp) {
      const stmt = this.db.prepare(`INSERT INTO PG1_COMPANY (name, addr1, addr2, city, state, zip, congressionalDistrict) VALUES(?, ?, ?, ?, ?, ?, ?)`);
			

			const insert =  this.db.transaction((comp)=> {
				try{
						stmt.run(comp.name, comp.addr1, comp.addr2, comp.city, comp.state, comp.zip, comp.congressionalDistrict)
				}catch(err){
					if(!this.db.inTransaction) throw err;
				}
			});

			insert(comp);

    }

    //insert into PG1_Media table
    pg1_MediaInsert(media) {
		 const stmt = this.db.prepare(`INSERT INTO PG1_MEDIA (filePath, fileType, description, medLength, source, compId) VALUES(?, ?, ?, ?, ?, ?)`);

			const insert = this.db.transaction((media)=> {
				try{
					stmt.run(media.filePath, media.fileType, media.description, media.medLength, media.source, media.compId)
				}catch(err){
					if(!this.db.inTransaction) throw err;
				}

			});

			insert(media);
    }

    //insert into PG1_Award table
    pg1_AwardInsert(award ) {
			const stmt = this.db.prepare(`INSERT INTO PG1_AWARD (piid, compId, currentTotal, potentialTotal, parentAwardAgency, awardingAgency, awardingOffice, fundingOffice, fiscalYear) 
				VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`);

			const insert = this.db.transaction((award)=>{
			try{
				stmt.run(award.piid, award.compId, award.currentTotal, award.potentialTotal, award.parentAwardAgency, award.awardingAgency, award.awardingOffice, award.fundingOffice, award.fiscalYear);
				
				}catch(err){
					if(!this.db.inTransaction) throw err;
				}
			});

			insert(award);
    }
    //gets all companies
    pg1_SelectsAllCompanies(){
      this.db.run("SELECT * FROM pg1_company;",[], (err, rows) =>{
        if(err){
          throw err;
        }
        rows.foreach((row)=>{
          console.log(row.name);
        });
      });
    }

    closeDb(){
        this.db.close();
    }

}

module.exports = Dao;
