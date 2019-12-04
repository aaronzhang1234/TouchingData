// purpose: defines a set of methods for interpreting ExcelJS data to be used by dataMigrator
// uses: DAO for data acess and insertion
// uses: ExcelJS to interpret Excel data
var Excel   = require("exceljs");

var Dao     = require("../../DAO.js");
let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
var dao = new Dao(sqlDatabaseName);

var types = require("./types.js")

let PlaceOfPerformance = require("../../models/PlaceOfPerformance");
let Ownership = require("../../models/RecipientOwnershipType.js");
let ParentAwardAgency = require("../../models/ParentAwardAgency");
let RecipientParent = require("../../models/RecipientParent.js");
let AwardingAgency = require("../../models/AwardingAgency");
let Recipient = require("../../models/Recipient.js");
var Type = require("../../models/OwnershipType.js");
let Office = require("../../models/Office.js");
let Award = require("../../models/Award.js");
let State = require("../../models/State.js");
let District = require("../../models/District.js");

class RowParser{
	// row is an json returned byan excelJs.Workbook object
	constructor(row){
		this.row = row
	}
	// inserts a place of performance record
	insertPlaceOfPerformance(){
		let pop_city = this.row.getCell(17).value;
		let pop_county = this.row.getCell(18).value;
		let pop_statecode = this.row.getCell(19).value;
		let pop_zip = this.convertToNoDecimal(this.row.getCell(21).value);
		let pop_district = this.convertToNoDecimal(this.row.getCell(22).value);
		
		let state = dao.selectStateByCode(pop_statecode);

		// some states are outliers which were not included in initial updload.
		// These are from outside of the United States, add them as part of the import
		if (state === null){
			state = new State(this.row.getCell(20).value, this.row.getCell(20).value);
			try{
			dao.insertState(state)
			}catch(err){}
			pop_stateCode = state.id
		}

		let district = new District(pop_district, pop_statecode);
		try {
			dao.insertDistrict(district);
		}catch(err){
		}

		
		let place_of_performance = new PlaceOfPerformance(null, pop_city, pop_county, pop_statecode, pop_zip, pop_district);
		try {
			dao.insertPlace(place_of_performance);
		}catch(err){
		}
	}

	//insert the parent company of an award recipient
	insertRecipientParent(){
		let parent_name = this.row.getCell(7).value;

		let recipient_parent = new RecipientParent(null, parent_name);
		try {
			dao.insertRecParent(recipient_parent);
		}catch(err){
	
		}
	}

	//inserts an award recipient record
	insertRecipient(){
		let name = this.row.getCell(6).value; 
		let addr = this.row.getCell(10).value; 
		let addr2 = this.row.getCell(11).value; 
		let city = this.row.getCell(12).value; 
		let state_code = this.row.getCell(13).value; 
		let zip = this.convertToNoDecimal(this.row.getCell(15).value); 
		let district = this.convertToNoDecimal(this.row.getCell(16).value);


		//Getting the object by name, if object is null then set id to null else set id to object.id
		let parent_name = this.row.getCell(7).value
		let parent = dao.selectRecipientParentbyName(parent_name);
		let parent_id = null;
		if(parent != null){
			parent_id = parent.id; 
		}

		let pop_city = this.convertToNoDecimal(this.row.getCell(17).value);
		let pop_zip = this.convertToNoDecimal(this.row.getCell(21).value);
		let PoP = dao.selectPlacePerformance(pop_city, pop_zip);
		let PoP_id = null;
		if(PoP != null){
			PoP_id = PoP.id; 
		}
		
		//create records for state not included in validation table
		let state = dao.selectStateByCode(state_code);
		if (state === null){
			state = new State(this.row.getCell(14).value, this.row.getCell(14).value);
			try {
			dao.insertState(state)
			}catch(err){}
			state_code = state.id
		}

		let district_object = new District(district, state_code);
		try {
			dao.insertDistrict(district_object);
		}catch(err){
		}

		let recipient = new Recipient(null, name, addr, addr2, city, state_code, zip, parent_id, district, null, PoP_id );
		try {
			dao.insertRecipient(recipient);
		}catch(err){
		}
	}

	//inserts the parent agency of the awarding agency
	insertParentAwardAgency(){
		let parent_award_agency_name = this.row.getCell(3).value;

		let parent_award_agency = new ParentAwardAgency(null, parent_award_agency_name);
		try{
			dao.insertParentAward(parent_award_agency);
		}catch(err){
		}
	}

	//inserts the awarding agency
	insertAwardingAgency(){
		let awarding_agency_name = this.row.getCell(2).value;
		let parent_award_agency_name = this.row.getCell(3).value;
		let paa = dao.selectParentAwardingAgency(parent_award_agency_name);
		let paa_id = null;
		if(paa !=null){
			paa_id = paa.id;
		}
		let awarding_agency = new AwardingAgency(null, awarding_agency_name, paa_id);
		try {
			dao.insertAwardingAgency(awarding_agency);
		}catch(err){
		}
	}

	//inserts an office of a government agency(either a funding office or a awarding office)
	insertOffices(){
		let awarding_office_name = this.row.getCell(8).value;
		let funding_office_name = this.row.getCell(9).value;

		let awarding_office = new Office(null, awarding_office_name);
		let funding_office = new Office(null, funding_office_name);

		try{
			dao.insertOffice(awarding_office);
		}catch(err){
		}
		try{
			dao.insertOffice(funding_office);
		}catch(err){
		}
	}

	//inserts an award record
	insertAward(){
		let award_piid = this.row.getCell(1).value;
		let fiscal_year = this.row.getCell(42).value; 

		let recipient_name = this.row.getCell(6).value;
		let recipient = dao.selectRecipientByName(recipient_name);
		let recipient_id = null
		if(recipient != null){
			recipient_id = recipient.id;
		}

		let current_total = this.row.getCell(4).value;
		let potential_total = this.row.getCell(5).value; 

		let awarding_agency_name = this.row.getCell(3).value;
		let awarding_agency = dao.selectAwardingAgency(awarding_agency_name);
		let awarding_agency_id = null;
		if(awarding_agency!= null){
			awarding_agency_id = awarding_agency.id;
		}

		let awarding_office_name = this.row.getCell(8).value;
		let awarding_office = dao.selectOffice(awarding_office_name);
		let awarding_office_id = null;
		if(awarding_office != null){
			awarding_office_id = awarding_office.id;
		}

		let funding_office_name = this.row.getCell(9).value;
		let funding_office = dao.selectOffice(funding_office_name);
		let funding_office_id = null;
		if(funding_office != null){
			funding_office_id = this.convertToNoDecimal(funding_office.id);
		}

		let award = new Award(award_piid, fiscal_year, recipient_id, current_total, potential_total, awarding_agency_id, awarding_office_id, funding_office_id);
		try {
			dao.insertAward(award);
		}catch(err){
		}
	}

	//for each recipient, createa a record for each *ownership type* marked as t in .xlsx
	insertOwnerships(){
		let recipient_name = this.row.getCell(6).value;
		let recipient = dao.selectRecipientByName(recipient_name);
		let recipient_id = null;
		if(recipient != null){
			recipient_id = recipient.id;
		}
		let thisthat = this;

		//this part of the algorithm is dependent both on the types object and the excel spreadsheet
		//they must be remain consistent formats
		types.forEach(function (type, i){
			//the first ownership type is at column 23 in the worksheet
			if (thisthat.row.getCell(i + 23).value === "t"){
				let ownership = new Ownership(type, recipient_id, null);
				try{
					dao.insertRecOwnership(ownership);
				}catch(err){
				}
			}
		});


	}

	//Do not insert as decimals instead insert as ints
	convertToNoDecimal(num){
		let num_string = String(num);
		let num_array = num_string.split(".");
		return num_array[0];
	}
}


module.exports = RowParser;
