/* ****************** MAIN.JS ******************
 * 2019 September 22 : Aaron Zhang : Created
 ********************************************
 * Purpose : Reads an excel spreadsheet and migrates the data to SQL using the sqlConnectInsert class.
 *
*/

var Company = require("../../models/Company.js");
var Dao = require("../../DAO.js");
var Excel = require("exceljs");
var sqlConnectInsert = require("./sqlConnectInsert.js");

let sqlDatabaseName = "data/POLITICS_OF_THE_GRID_1.db";
var sqlHelper = new sqlConnectInsert(sqlDatabaseName);
var dao = new Dao(sqlDatabaseName);

let workbook = new Excel.Workbook();
workbook.xlsx.readFile("data/ProjectDataBig.xlsx").then(function(){
    let worksheet = workbook.getWorksheet("All_FY_Combined");
    var migrate = new Promise((resolve, reject)=>{
        worksheet.eachRow(function(row, index){
					  let company = new Company()
					  company = dao.selectCompanyByName(row.getCell(6).value);

						if(!company.name){
            		company.name = row.getCell(6).value;    
            		company.addr1 = row.getCell(10).value;
            		company.addr2 = row.getCell(11).value;
            		company.city = row.getCell(12).value;
            		company.state = row.getCell(13).value;
            		company.zip = row.getCell(15).value;
            		company.district = row.getCell(16).value;
						
            		try{
               		 	sqlHelper.pg1_CompanyInsert(company);
										company = dao.selectCompanyByName(.getCell(6).value);
								}
								catch(e){
										//console.log(e);
            		}
						}
        })
    });
    //Once the eachRow function is complete, then close the DB.
    migrate.then(()=>{
      sqlHelper.closeDb();
    });
});
