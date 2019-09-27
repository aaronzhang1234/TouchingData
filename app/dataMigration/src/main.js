/* ****************** MAIN.JS ******************
 * 2019 September 24 : Nathan Reiber : import Awards
 * 2019 September 23 : Nathan Reiber : use Dao, validate data migrate to award
 * 2019 September 22 : Aaron Zhang   : Created
 ********************************************
 * Purpose : Reads an excel spreadsheet and migrates the data to SQL using the sqlConnectInsert class.
 *
*/

<<<<<<< HEAD
var Excel = require("exceljs");
var sqlConnectInsert = require("./sqlConnectInsert.js");
var Dao = require("../../DAO.js");
=======
var Company = require("../../models/Company.js");
var Award   = require("../../models/Award.js");
>>>>>>> master

var Dao     = require("../../DAO.js");
let sqlDatabaseName = "data/POLITICS_OF_THE_GRID_1.db";
<<<<<<< HEAD
var sqlHelper = new sqlConnectInsert(sqlDatabaseName);
var dao = new Dao(sqlDatabaseName);
=======
var dao = new Dao(sqlDatabaseName);

var Excel   = require("exceljs");

>>>>>>> master

/*
let workbook = new Excel.Workbook();
workbook.xlsx.readFile("data/ProjectDataBig.xlsx").then(function(){
    let worksheet = workbook.getWorksheet("All_FY_Combined");
    var migrate = new Promise((resolve, reject)=>{
        worksheet.eachRow(function(row, index){
<<<<<<< HEAD
            let companyName = row.getCell(6).value;    
            let addr1 = row.getCell(10).value;
            let addr2 = row.getCell(11).value;
            let city = row.getCell(12).value;
            let state = row.getCell(13).value;
            let zipcode = row.getCell(15).value;
            let congressionalDistrict = row.getCell(16).value;
            sqlHelper.pg1_CompanyInsert(companyName, addr1, addr2, city, state, zipcode, congressionalDistrict);
=======
					 	//the first row of this worksheet is a header, do not consume these fields
						if (index != 1){

								//zip is a TEXT type field (sometimes alphanumeric)
								//the exceljs worksheet framework will return all to numeric fields as reals
								//to recast those numberic fields as Integers take the first substring
						    var zip = String(row.getCell(15).value)
								let zipArray = zip.split(".");
								zip = zipArray[1];

								company = new Company("",row.getCell(6).value, row.getCell(10).value, row.getCell(11).value, row.getCell(12).value, row.getCell(13).value, zip, row.getCell(16).value);
								try {
										dao.pg1_CompanyInsert(company);
								}catch(err) {
										console.log(err);
								}

								company = dao.selectCompanyByName(company.name);
								

								try {
										award = new Award("", row.getCell(1).value, company.id, row.getCell(4).value,row.getCell(5).value, row.getCell(2).value, row.getCell(3).value, row.getCell(8).value, row.getCell(9).value, row.getCell(42).value)
								}catch(err) {
										console.log(err);
								}
								dao.pg1_AwardInsert(award)
					
						}
>>>>>>> master
        })
    });
    //Once the eachRow function is complete, then close the DB.
    migrate.then(()=>{
      dao.closeDb();
    });
});
*/
