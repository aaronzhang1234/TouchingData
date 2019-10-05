/* ****************** MAIN.JS ******************
 * 2019 September 24 : Nathan Reiber : import Awards
 * 2019 September 23 : Nathan Reiber : use Dao, validate data migrate to award
 * 2019 September 22 : Aaron Zhang   : Created
 ********************************************
 * Purpose : Reads an excel spreadsheet and migrates the data to SQL using the sqlConnectInsert class.
 *
*/

var Recipient = require("../../models/Recipient.js");
var Award   = require("../../models/Award.js");
var State = require("../../models/State.js");
var District = require("../../models/District.js");

var RowParser = require("./RowParser.js");

var Dao     = require("../../DAO.js");
let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
var dao = new Dao(sqlDatabaseName);

var Excel   = require("exceljs");



let workbook = new Excel.Workbook();
workbook.xlsx.readFile("data/ProjectDataBig.xlsx").then(function(){
    let worksheet = workbook.getWorksheet("All_FY_Combined");
    var migrate = new Promise((resolve, reject)=>{
        worksheet.eachRow(function(row, index){
		 	//the first row of this worksheet is a header, do not consume these fields
			if (index != 1){
				//console.log(`Currently on row ${index}`);
				let parser = new RowParser(row);	
				//This order of inserts is very important, do not move. 
				parser.insertPlaceOfPerformance();
				parser.insertRecipientParent();
				parser.insertRecipient();
				parser.insertOwnerships();

				parser.insertParentAwardAgency();
				parser.insertAwardingAgency();
				parser.insertOffices();
				parser.insertAward();

			}
        })
    });
    //Once the eachRow function is complete, then close the DB.
    migrate.then(()=>{
      dao.closeDb();
    });
});

