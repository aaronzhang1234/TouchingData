const sqlite3 = require('sqlite3').verbose();

class insertIntoDatabase {
    //constructor connects to database with file path given
    constructor(dbFilePath){
        this.db = new sqlite3.Database(dbFilePath, (err)=> {
            if (err){
                return console.error(err.message);
            }
            console.log('Connected to database');
        })
    }

    //insert into PG1_Company table
    pg1_CompanyInsert(name, addr1, addr2, city, state, zip, congressionalDistrict) {
        /*
            function(result,error){} 
            can be easily replaced by 
            (result,error)=>{}
        */
        this.db.run(`INSERT INTO pg1_company (name, addr1, addr2, city,
            state, zip, congressionalDistrict) VALUES(?,?,?,?,?,?,?)`,
        [name, addr1, addr2, city, state, zip, congressionalDistrict],function(error){
            if(!error){
                console.log(name + " has been added to the table");
            }
        })
    }

    //insert into PG1_Media table
    pg1_MediaInsert(filePath, fileType, description, medLength, source, compId) {
        this.db.run(`INSERT INTO pg1_media (filePath, fileType, description, 
            medLength, source, compId) VALUES(?,?,?,?,?,?)`,
        [filePath, fileType, description, medLength, source, compId])
    }

    //insert into PG1_Award table
    pg1_AwardInsert(piid, compId, currentTotal, potentialTotal, parentAwardAgency, awardingAgency,
        fundingOffice, fiscalYear) {
        this.db.run(`INSERT INTO pg1_award (piid, compId, currentTotal, potentialTotal, 
            parentAwardAgency, awardingAgency, awardingOffice, 
            fundingOffice, fiscalYear) VALUES(?,?,?,?,?,?,?,?,?)`,
        [piid, compid, currentTotal, potentialTotal, parentAwardAgency, 
            awardingOffice, fundingOffice, fiscalYear  ])
    }

    closeDb(){
        this.db.close();
    }

}

module.exports = insertIntoDatabase;