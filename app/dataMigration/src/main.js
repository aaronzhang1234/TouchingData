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
				//zip is a TEXT type field (sometimes alphanumeric)
				//the exceljs worksheet framework will return all to numeric fields as reals
				//to recast those numberic fields as Integers take the first substring
			    var zip = String(row.getCell(15).value)
				let zipArray = zip.split(".");
				zip = zipArray[1];
				
				let parser = new RowParser(row);	
				
				parser.insertParentAwardAgency();		
				parser.insertPlaceOfPerformance();
				parser.insertRecipientParent();
				parser.insertRecipientOwnershipTypes();

				
				//parser.insertAwardingAgency();
				//parser.insertRecipient();
				//parser.insertAward();

			}
        })
    });
    //Once the eachRow function is complete, then close the DB.
    migrate.then(()=>{
      dao.closeDb();
    });
});

