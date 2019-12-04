const Sql = require('better-sqlite3');

const Excel = require("exceljs")
const db = new Sql('data/POLITICS_OF_THE_GRID.db')
const url = require("url");
const DAO = require('../../app/DAO.js')
const RowParser = require('../../app/dataMigration/src/RowParser.js')
const dao = new DAO('data/POLITICS_OF_THE_GRID.db')

try { db.prepare('UPDATE PG1_AWARD SET AWARDING_AGENCY_ID = NULL').run()}
catch{console.log(err)}

try{
	db.prepare('DROP TABLE IF EXISTS PG1_AWARDING_AGENCY').run()
}
catch(err){
	console.log(err)
	return
}

try{
	db.prepare('DROP TABLE IF EXISTS PG1_PARENT_AWARD_AGENCY').run()
}
catch(err){
	console.log(err)
	return
}

try{
	dao.createParentAgencyTable();
}
catch(err){
	console.log(err)
	return
}
try{
	dao.createAwardingAgencyTable();
}

catch(err){
	console.log(err)
	return
}

let workbookName = "data/ProjectDataBig.xlsx"; 
let worksheetName ="All_FY_Combined"
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


				try{
					parser.insertParentAwardAgency();
				}catch(err){
					console.log(err)
				}
				try{
					parser.insertAwardingAgency();
				}catch(err){
					console.log(err)
				}
				let agency = dao.selectAwardingAgency(row.getCell(2).value)
				if (agency === null){
					agency = dao.selectAwardingAgency("DEPARTMENT OF HOMELAND SECURITY (DHS)")
				}
				if (agency != null){
					db.prepare('UPDATE PG1_AWARD SET awarding_agency_id = ? where award_id_piid = ?').run(agency.id,row.getCell(1).value)
				}


			}
		});
	}).then(function(){
	});
});




