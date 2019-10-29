/* ****************** initDb ******************
 * 2019 October 01 : Nathan Reiber  : Created
 ********************************************
 * Purpose : defines a set of methods for dropping and creating tables and inserting records into validation tables
 */

var Dao = require("../../DAO.js");
let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
var dao = new Dao(sqlDatabaseName);

var childProcess = require('child_process');

//models
var Type = require("../../models/OwnershipType.js");
var State = require("../../models/State.js");
var District = require("../../models/District.js");

var Excel = require("exceljs");
let workbook = new Excel.Workbook();
let workbook2= new Excel.Workbook();

var types = require("./types.js") 

class DbBuilder{

	// backup up the database, drop all tables, create all tables and initialize vaildation tables
	buildDb(){
		dao.backupDb();
		dao.dropAllTables();
		dao.createAllTables();
		this.initValidationTables();
	}

	
	//initialize all validation tables
	initValidationTables(){
		this.initOwnershipTypes();
		this.initStates();
		this.initCongressionalDistricts();
	}
	
	//insert all ownership types into PG1_OWNERSHIP_TYPE
	initOwnershipTypes(){
		types.forEach(function(type){
			let ownType = new Type(type,"");
			try{
				dao.insertOwnershipType(ownType);
			}catch(err){
				//console.log(err);
			}
		});
	}

	//retrieves state postal codes for all us postal addresses from Excel spreadsheet
	//inserts all state into PG1_STATE
	initStates(){
		workbook.xlsx.readFile("data/postalCodes.xlsx").then(function(){
			var addStates = new Promise((resolve, reject)=>{
				let worksheet = workbook.getWorksheet("postalCodes");
				worksheet.eachRow(function(row,index){
					let state = new State(row.getCell(2).value, row.getCell(1).value)
					//console.log(state);
					try{
						dao.insertState(state);
					}catch(err){
						console.log(err);
					}
				});
			});
			addStates.then(()=>{});
		});
	}

	//retrieves all congressional district from an Excel spreadsheet
	//inserts all district into PG1_CONGRESSIONAL_DISTRICT
	initCongressionalDistricts(){
		workbook.xlsx.readFile("data/districts.xlsx").then(function(){
			var addDistricts = new Promise((resolve, reject)=>{
				let worksheet = workbook.getWorksheet("congress");
				worksheet.eachRow(function(row,index){
					// only representatives in congress have congressional districts
					if (row.getCell(1).value == "rep"){
						let district = new District(row.getCell(3).value, row.getCell(2).value)
						//console.log(district);
						try{
							dao.insertDistrict(district)
						}catch(err){
							console.log(err);
						}
					}
				});
			});
			addDistricts.then(()=>{
			}).catch(function(err){
				console.log(err);
			});
		});
	}
}

module.exports = DbBuilder;



