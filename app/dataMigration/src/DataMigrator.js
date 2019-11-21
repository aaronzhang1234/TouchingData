/* ****************** dataMigrator.js ******************
 * 2019 October 23 : Nathan Reiber : Created
 ********************************************
 * Purpose : Reads an excel spreadsheet and migrates the data to SQL using the sqlConnectInsert class.
 *
 */
var EM = require('../../emitter.js')
var RowParser = require("./RowParser.js");
var Excel   = require("exceljs");

class DataMigrator {
	 migrateData(workbookName = "data/ProjectDataBig.xlsx", worksheetName ="All_FY_Combined"){
		let workbook = new Excel.Workbook();
		workbook.xlsx.readFile(workbookName).then(function(){
			let worksheet = workbook.getWorksheet(worksheetName);
			
			var migrate = new Promise((resolve, reject)=>{
				worksheet.eachRow(function(row, index){
					//the first row of this worksheet is a header, do not consume these fields
					if (index != 1){
						if (index%50 == 0){
							console.log(`Currently on row ${index}`);
						}
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
						}catch(err){}
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
				});
				console.log("done")
				EM.emit('migrate', {
					progress:1,
					status:"done"
				})
			}).then(function(){
			});
		});
	 }
}

module.exports = DataMigrator;
