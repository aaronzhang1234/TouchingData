var Dao = require("../../DAO.js");
let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
var dao = new Dao(sqlDatabaseName);

//models
var Type = require("../../models/OwnershipType.js");
var State = require("../../models/State.js");
var District = require("../../models/District.js");

var Excel = require("exceljs");
let workbook = new Excel.Workbook();
let workbook2= new Excel.Workbook();

const types = ["alaskan_native_owned_corporation_or_firm", "american_indian_owned_business", "indian_tribe_federally_recognized", "native_hawaiian_owned_business", "tribally_owned_business", "veteran_owned_business", "service_disabled_veteran_owned_business", "woman_owned_business", "women_owned_small_business", "economically_disadvantaged_women_owned_small_business", "joint_venture_women_owned_small_business", "joint_venture_economic_disadvantaged_women_owned_small_business", "asian_pacific_american_owned_business", "black_american_owned_business", "hispanic_american_owned_business", "native_american_owned_business", "other_minority_owned_business"];

types.forEach(function(type){
	ownType = new Type(type,"");
	try{
		dao.insertOwnershipType(ownType);
	}catch(err){
		console.log(err);
	}
});

workbook.xlsx.readFile("data/postalCodes.xlsx").then(function(){
	var addStates = new Promise((resolve, reject)=>{
		let worksheet = workbook.getWorksheet("postalCodes");
		worksheet.eachRow(function(row,index){
			let state = new State(row.getCell(2).value, row.getCell(1).value)
			console.log(state);
			try{
				dao.insertState(state);
			}catch(err){
				console.log(err);
			}
		});
	});
	addStates.then(()=>{});
});
workbook.xlsx.readFile("data/districts.xlsx").then(function(){
	var addDistricts = new Promise((resolve, reject)=>{
		let worksheet = workbook.getWorksheet("congress");
		worksheet.eachRow(function(row,index){
			// only representatives in congress have congressional districts
			if (row.getCell(1).value == "rep"){
				district = new District(row.getCell(3).value, row.getCell(2).value)
				console.log(district);
				try{
					dao.insertDistrict(district)
				}catch(err){
					console.log(err);
				}
			}
		});
	});
	addDistricts.then(()=>{
		dao.closeDb();
	}).catch(function(){
		dao.closeDb();
		console.log("Promise Rejected");
	});
});
