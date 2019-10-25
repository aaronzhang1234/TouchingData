/* ****************** initDb ******************
 * 2019 October 01 : Nathan Reiber  : Created
 ********************************************
 * Purpose : drop and create all tables
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

	buildDb(){
		dao.backupDb();
		dao.dropAllTables();
		dao.createAllTables();
		this.initValidationTables();
	}

	initValidationTables(){
		this.initOwnershipTypes();
		this.initStates();
		this.initCongressionalDistricts();
	}
	
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



