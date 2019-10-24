/* ****************** MAIN.JS ******************
 * 2019 September 24 : Nathan Reiber : import Awards
 * 2019 September 23 : Nathan Reiber : use Dao, validate data migrate to award
 * 2019 September 22 : Aaron Zhang   : Created
 ********************************************
 * Purpose : Reads an excel spreadsheet and migrates the data to SQL using the sqlConnectInsert class.
 *
 */

var RowParser = require("./RowParser.js");
var Excel   = require("exceljs");

let workbook = new Excel.Workbook();
workbook.xlsx.readFile("data/ProjectDataBig.xlsx").then(function(){
	let worksheet = workbook.getWorksheet("All_FY_Combined");
	var migrate = new Promise((resolve, reject)=>{
		worksheet.eachRow(function(row, index){
			//the first row of this worksheet is a header, do not consume these fields
			if (index != 1){
				if (index % 500 === 0) console.log(`Currently on row ${index}`);
				let parser = new RowParser(row);	
				//This order of inserts is very important, do not move. 
				try {
					parser.insertPlaceOfPerformance();
				}catch(err){ }
				try{
					parser.insertRecipientParent();
				}catch(err){}
				try{
					parser.insertRecipient();
				}catch(err){console.log(err)}
				try{
					parser.insertOwnerships();
				}catch(err){}
				try{
					parser.insertParentAwardAgency();
				}catch(err){}
				try{
					parser.insertAwardingAgency();
				}catch(err){}
				try{
					parser.insertOffices();
				}catch(err){}
				try{
					parser.insertAward();
				}catch(err){}

			}
		})
		console.log("migration done");
	});
	//Once the eachRow function is complete, then close the DB.
});

