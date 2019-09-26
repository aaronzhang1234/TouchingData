/* ****************** MAIN.JS ******************
 * 2019 September 23   Nathan Reiber : use Dao, validate data migrate to award
 * 2019 September 22 : Aaron Zhang : Created
 ********************************************
 * Purpose : Reads an excel spreadsheet and migrates the data to SQL using the sqlConnectInsert class.
 *
*/

var Company = require("../../models/Company.js");
var Award   = require("../../models/Award.js");
var Dao     = require("../../DAO.js");
var Excel   = require("exceljs");
let sqlDatabaseName = "data/POLITICS_OF_THE_GRID_1.db";

var dao = new Dao(sqlDatabaseName);

let workbook = new Excel.Workbook();
workbook.xlsx.readFile("data/ProjectDataBig.xlsx").then(function(){
    let worksheet = workbook.getWorksheet("All_FY_Combined");
    var migrate = new Promise((resolve, reject)=>{
        worksheet.eachRow(function(row, index){

					  let company = new Company()
						let award = new Award()
					  company = dao.selectCompanyByName(row.getCell(6).value);

						if(!company){
            		try{
										company = new company(row.getCell(6).value, row.getCell(10).value, row.getCell(11).value, row.getCell(12).value, row.getCell(13).value, row.getCell(15).value, row.getCell(16).value);
										dao.pg1_CompanyInsert(company);
										company = dao.selectCompanyByName(row.getCell(6));
								}
								catch(e){
										//console.log(e);
            		}
						
						}
						award.piid = row.getCell(1).value;
						award.compId = company.id;
						award.parentAwardAgency = row.getCell(2).value;
						award.awardingAgency = row.getCell(3).value;
						award.currentTotal = row.getCell(4).value;
						award.potentialTotal = row.getCell(5).value;
						award.awardingOffice = row.getCell(8).value;
						award.fundingOffice = row.getCell(9).value;
						award.fiscalYear = row.getCell(42).value;
					
						try{
								dao.pg1_AwardInsert(award)
						}
						catch(e){
								//console.log(e);
           	}
        })
    });
    //Once the eachRow function is complete, then close the DB.
    migrate.then(()=>{
      dao.closeDb();
    });
});
