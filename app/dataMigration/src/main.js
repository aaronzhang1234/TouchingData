/* ****************** MAIN.JS ******************
 * 2019 September 22 : Aaron Zhang : Created
 ********************************************
 * Purpose : Reads an excel spreadsheet and migrates the data to SQL using the sqlConnectInsert class.
 *
*/

var Excel = require("exceljs");
var sqlConnectInsert = require("./sqlConnectInsert.js");
var Dao = require("../../DAO.js");

let sqlDatabaseName = "data/POLITICS_OF_THE_GRID_1.db";
var sqlHelper = new sqlConnectInsert(sqlDatabaseName);
var dao = new Dao(sqlDatabaseName);

/*
let workbook = new Excel.Workbook();
workbook.xlsx.readFile("data/ProjectDataBig.xlsx").then(function(){
    let worksheet = workbook.getWorksheet("All_FY_Combined");
    var migrate = new Promise((resolve, reject)=>{
        worksheet.eachRow(function(row, index){
            let companyName = row.getCell(6).value;    
            let addr1 = row.getCell(10).value;
            let addr2 = row.getCell(11).value;
            let city = row.getCell(12).value;
            let state = row.getCell(13).value;
            let zipcode = row.getCell(15).value;
            let congressionalDistrict = row.getCell(16).value;
            sqlHelper.pg1_CompanyInsert(companyName, addr1, addr2, city, state, zipcode, congressionalDistrict);
        })
    });
    //Once the eachRow function is complete, then close the DB.
    migrate.then(()=>{
        sqlHelper.closeDb();
    });
});
*/
