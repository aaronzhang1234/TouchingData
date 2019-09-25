/* ****************** DAO ******************
 * 2019 September 22 : Justine Delisi : add insert methods
 * 2019 September 22 : Nathan Reiber  : Created
 ********************************************
 * Purpose : defines a set of data access methods to select from PofG database 
 *
*/

var Company = require('./models/Company.js');
const sqlite3 = require('sqlite3').verbose();
var Company = require("./models/Company.js");
var Award = require("./models/Award.js");
var Media = require("./models/Media.js");

class Dao {
    //constructor connects to database with file path given
    constructor(dbFilePath){
			 this.db = new sqlite3.Database(dbFilePath, (err)=> { // initialize an sqlite3 object named db
            if (err){
                return console.error(err.message);
            }
            console.log('Connected to database');
        })
    }

	  // returns a company object selected from the name index on PG1_COMPANY
    selectCompanyByName(name) {
      this.db.get(`SELECT * FROM PG1_COMPANY where name = ? `,
					[name], (err, row)=>{
					if(err){
						throw err;
					}

					if(row){
							company = new Company(row.id, row.name, row.addr1, row.addr2, row.city, row.state, row.zip, row.district)
					}
					else return 0;
					return company
				});
		}

	  // returns a company object selected from the id index on PG1_COMPANY
    selectCompanyById(id) {
      this.db.get(`SELECT * FROM PG1_COMPANY where id = ? `,
					[id], (err, row)=>{
					if(err){
						throw err;
					}
					const company = new Company();
					company = new Company(row.id, row.name, row.addr1, row.addr2, row.city, row.state, row.zip, row.district)
					return  company
				});
		}
	
    pg1_CompanyInsert(name, addr1, addr2, city, state, zip, district, website) {
        /*
            function(result,error){} 
            can be easily replaced by 
            (result,error)=>{}
        */
        this.db.run(`INSERT INTO pg1_company (name, addr1, addr2, city,
            state, zip, congressionalDistrict) VALUES(?,?,?,?,?,?,?)`,
        [name, addr1, addr2, city, state, zip, district, website],function(error){
					if(error){
						//throw new Error(name + " has not been added to the table");
					}
        })
    }

    //insert into PG1_Media table
    pg1_MediaInsert(media) {
        this.db.run(`INSERT INTO pg1_media (filePath, fileType, description, medLength, source, compId) VALUES(?,?,?,?,?,?)`,
        [media.filePath, media.fileType, media.description, media.medLength, media.source, media.compId])
    }

    //insert into PG1_Award table
    pg1_AwardInsert(award ) {
        this.db.run(`INSERT INTO pg1_award (piid, compId, currentTotal, potentialTotal, parentAwardAgency, awardingAgency, awardingOffice, fundingOffice, fiscalYear) VALUES(?,?,?,?,?,?,?,?,?)`,
        [	award.piid, award.compid, award.currentTotal, award.potentialTotal, award.parentAwardAgency, award.awardingOffice, award.fundingOffice, award.fiscalYear  ])
    }

    closeDb(){
        this.db.close();
    }

}

module.exports = Dao;
