/* ****************** DAO ******************
 * 2019 September 22 : Nathan Reiber : Created
 ********************************************
 * Purpose : defines a set of data access methods to select from PofG database 
 *
*/

import Company from './models/Company.js'
const sqlite3 = require('sqlite3').verbose();

class DAO {
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

    closeDb(){
        this.db.close();
    }

}
