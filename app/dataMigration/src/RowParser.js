var Excel   = require("exceljs");

var Dao     = require("../../DAO.js");
let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
var dao = new Dao(sqlDatabaseName);

const types = ["alaskan_native_owned_corporation_or_firm", "american_indian_owned_business", "indian_tribe_federally_recognized", "native_hawaiian_owned_business", "tribally_owned_business", "veteran_owned_business", "service_disabled_veteran_owned_business", "woman_owned_business", "women_owned_small_business", "economically_disadvantaged_women_owned_small_business", "joint_venture_women_owned_small_business", "joint_venture_economic_disadvantaged_women_owned_small_business", "asian_pacific_american_owned_business", "black_american_owned_business", "hispanic_american_owned_business", "native_american_owned_business", "other_minority_owned_business"];

let State = require("../../models/State.js")
let District = require("../../models/District.js");
let PlaceOfPerformance = require("../../models/PlaceOfPerformance");
let Ownership = require("../../models/RecipientOwnershipType.js");
var Type = require("../../models/OwnershipType.js");


let ParentAwardAgency = require("../../models/ParentAwardAgency");
let AwardingAgency = require("../../models/AwardingAgency");
let Recipient = require("../../models/Recipient.js");
let Award = require("../../models/Award.js");
let RecipientParent = require("../../models/RecipientParent.js");
let Office = require("../../models/Office.js");
class RowParser{
	constructor(row){
		this.row = row
	}

	// states should be handled by the InitValidationTables script
	//Inserting recipients info vs inserting place of performance
	//insertState(is_recipient){
	//	let state_code, state_name = "";
	//      if(is_recipient){
	//	    state_code = this.row.getCell(13).value;
	//          state_name = this.row.getCell(14).value;
	//      }else{
	//	    state_code = this.row.getCell(19).value;
	//          state_name = this.row.getCell(20).value;
	//      }
	//	let state = new State(state_code, state_name);
	//	dao.insertState(state);
	//  }
	//  districts should be handled by  initvalidationsTables Script
	//   insertDistrict(is_recipient){
	//      let district_num = 0 
	//      let state_code = "";
	//      if(is_recipient){
	//          district_num = this.row.getCell(16).value;
	//          state_code = this.row.getCell(13).value;
	//      }else{
	//          district_num = this.row.getCell(22).value;
  //          state_code = this.row.getCell(19).value;
  //      }
  //      let district = new District(district_num, state_code);
  //      dao.insertDistrict(district);
  //  }
    insertPlaceOfPerformance(){
        let pop_city = this.row.getCell(17).value;
        let pop_county = this.row.getCell(18).value;
        let pop_statecode = this.row.getCell(19).value;

        let pop_zip = this.row.getCell(21).value;
        if(pop_zip != null){
            pop_zip = this.convertToInt(pop_zip); 
        }

        let pop_district = this.row.getCell(22).value;
        if(pop_district != null){
            pop_district = this.convertToInt(pop_district); 
        }
    
        let placeofperformance = new PlaceOfPerformance("", pop_city, pop_county, pop_statecode, pop_zip, pop_district);
        dao.insertPlace(placeofperformance);
    }
    //complete enough
    insertRecipientParent(){
        let parent_name = this.row.getCell(7).value;
        
        let recipientparent = new RecipientParent("", parent_name);
        dao.insertRecParent(recipientparent);
    }
    insertRecipient(){
        let name = this.row.getCell(6).value; 
        let addr = this.row.getCell(10).value; 
        let addr2 = this.row.getCell(11).value; 
        let city = this.row.getCell(12).value; 
        let state_code = this.row.getCell(13).value; 
        let zip = this.convertToInt(this.row.getCell(15).value); 
        let district = this.convertToInt(this.row.getCell(16).value);

        let parent_name = this.row.getCell(7).value
        let parent = dao.selectRecipientParentbyName(parent_name);
        let parentid = "";
        if(parent != null){
             parentid = parent.id; 
        }

        let pop_city = this.convertToInt(this.row.getCell(17).value);
        let pop_zip = this.convertToInt(this.row.getCell(21).value);
        let PoP = dao.selectPlacePerformance(pop_city, pop_zip);
        let PoPid = "";
        if(PoP != null){
            PoPid = PoP.id; 
        }

        let recipient = new Recipient("", name, addr, addr2, city, state_code, zip, parentid, district, "", PoPid );
        dao.insertRecipient(recipient);
    }
    insertRecipientOwnershipTypes(){    
        let ownershipTypes = [
            {name:"alaskan_native_owned_corporation_or_firm", cell:23},
            {name:"american_indian_owned_business", cell:24},
            {name:"indian_tribe_federally_recognized", cell:25},
            {name:"native_hawaiian_owned_business", cell:26},
            {name:"tribally_owned_business", cell:27},
            {name:"veteran_owned_business", cell:28},
            {name:"service_disabled_veteran_owned_business", cell:29},
            {name:"woman_owned_business", cell:30},
            {name:"women_owned_small_business", cell:31},
            {name:"economically_disadvantaged_women_owned_small_business", cell:32},
            {name:"joint_venture_women_owned_small_business", cell:33},
            {name:"joint_venture_economic_disadvantaged_women_owned_small_bus", cell:34},
            {name:"minority_owned_business", cell:35},
            {name:"subcontinent_asian_asian_indian_american_owned_business", cell:36},
            {name:"asian_pacific_american_owned_business", cell:37},
            {name:"black_american_owned_business", cell:38},
            {name:"hispanic_american_owned_business", cell:39},
            {name:"native_american_owned_business", cell:40},
            {name:"other_minority_owned_business", cell:41},            
        ]
        //get recipient id
        for(let i = 0; i<ownershipTypes.length; i++){
            let ownershipType = ownershipTypes[i];
            if(this.row.getCell(ownershipType.cell).value == "t"){
                //get ownershipid
                //dao.insertRecOwnership(ownershipid, recipientid, "")
            }
        }
    }
    insertParentAwardAgency(){
        let parent_award_agency_name = this.row.getCell(2).value;

        let parentawardagency = new ParentAwardAgency("", parent_award_agency_name);
        dao.insertParentAward(parentawardagency);
    }
    insertAwardingAgency(){
        let awarding_agency_name = this.row.getCell(3).value;
        let parent_award_agency_name = this.row.getCell(2).value;
        let paa = dao.selectParentAwardingAgency(parent_award_agency_name);
        let paaid = "";
        if(paa !=null){
            paaid = paa.id;
        }
        let awardingagency = new AwardingAgency("", awarding_agency_name, paaid);
        dao.insertAwardingAgency(awardingagency);
    }
    insertOffices(){
        let awarding_office_name = this.row.getCell(8).value;
        let funding_office_name = this.row.getCell(9).value;
        
        let awarding_office = new Office("", awarding_office_name);
        let funding_office = new Office("", funding_office_name);

        dao.insertOffice(awarding_office);
        dao.insertOffice(funding_office);
    }
    insertAward(){
        let award_piid = this.row.getCell(1).value;
        let fiscal_year = this.row.getCell(42).value; 

        let recipient_name = this.row.getCell(6).value;
        let recipient = dao.selectRecipientByName(recipient_name);
        let recipient_id = "";
        if(recipient != null){
            recipient_id = recipient.id;
        }

        let current_total = this.row.getCell(4).value;
        let potential_total = this.row.getCell(5).value; 

        let awarding_agency_name = this.row.getCell(3).value;
        let awarding_agency = dao.selectAwardingAgency(awarding_agency_name);
        let awarding_agency_id = "";
        if(awarding_agency!= null){
            awarding_agency_id = awarding_agency.id;
        }

        let awarding_office_name = this.row.getCell(8).value;
        let awarding_office = dao.selectOffice(awarding_office_name);
        let awarding_office_id = "";
        if(awarding_office != null){
            awarding_office_id = awarding_office.id;
        }

        let funding_office_name = this.row.getCell(9).value;
        let funding_office = dao.selectOffice(funding_office_name);
        let funding_office_id = "";
        if(funding_office != null){
            funding_office_id = this.convertToInt(funding_office.id);
        }

        let award = new Award(award_piid, fiscal_year, recipient_id, current_total, potential_total, awarding_agency_id, awarding_office_id, funding_office_id);
        dao.insertAward(award);
    }

	insertOwnerships(recipientId){
		types.forEach(function (type, i){
			//the first ownership type is at column 23 in the worksheet
			if (row.getCell(i + 23).value === "t"){
				ownership = new Ownership(type, recipientId, "");
				insertRecOwnership(ownership);
			}
		});
	}
    convertToInt(num){
        let numString = String(num);
        let numArray = numString.split(".");
        return numArray[0];
    }
}

module.exports = RowParser;
