/* ****************** DAO ******************
 * 2019 September 22 : Justin Delisi : add insert methods
 * 2019 September 22 : Nathan Reiber  : Created
 ********************************************
 * Purpose : defines a set of data access methods to select from PofG database 
 *
*/

<<<<<<< HEAD
//import Company from './models/Company.js'
=======
>>>>>>> 4da0fd519862c15b29e46f8428dae7b08f9714c8
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
        [name], (err, row))

			if(err){
				throw err;
			}

			const company = new Company(row.id, row.name, row.addr1, row.addr2, row.city, row.state, row.zip, row.district)
			return  company
    }

	  // returns a company object selected from the id index on PG1_COMPANY
    selectCompanyById(id) {
      this.db.get(`SELECT * FROM PG1_COMPANY where id = ? `,
        [id], (err, row))

			if(err){
				throw err;
			}
			const company = new Company(row.id, row.name, row.addr1, row.addr2, row.city, row.state, row.zip, row.district)
			return  company
    }
	
    //insert into PG1_Company table
    pg1_CompanyInsert(company) {
        this.db.run(`INSERT INTO pg1_company (name, addr1, addr2, city,
             state, zip, congressionalDistrict) VALUES(?,?,?,?,?,?,?)`,
        [company.name, company.addr1, company.addr2, company.city, company.state, company.zip, company.district])
    }

    //insert into PG1_Media table
    pg1_MediaInsert(media) {
        this.db.run(`INSERT INTO pg1_media (filePath, fileType, description, 
            medLength, source, compId) VALUES(?,?,?,?,?,?)`,
        [media.filePath, media.fileType, media.description, media.medLength, media.source, media.compId])
    }

    //insert into PG1_Award table
    pg1_AwardInsert(award ) {
        this.db.run(`INSERT INTO pg1_award (piid, compId, currentTotal, potentialTotal, 
            parentAwardAgency, awardingAgency, awardingOffice, 
            fundingOffice, fiscalYear) VALUES(?,?,?,?,?,?,?,?,?)`,
        [	award.piid, award.compid, award.currentTotal, award.potentialTotal, award.parentAwardAgency, award.awardingOffice, award.fundingOffice, award.fiscalYear  ])
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

<<<<<<< HEAD
module.exports=DAO;
=======
module.exports = Dao;
>>>>>>> 4da0fd519862c15b29e46f8428dae7b08f9714c8
