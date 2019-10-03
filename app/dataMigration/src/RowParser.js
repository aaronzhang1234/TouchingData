var Dao     = require("../../DAO.js");
let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
var dao = new Dao(sqlDatabaseName);


let State = require("../../models/State.js")
let District = require("../../models/District.js");
let PlaceOfPerformance = require("../../models/PlaceOfPerformance");

let ParentAwardAgency = require("../../models/ParentAwardAgency");
let Recipient = require("../../models/Recipient.js");
let Award = require("../../models/Award.js");
class RowParser{
    constructor(row){
        this.row = row
    }

    //Inserting recipients info vs inserting place of performance
    insertState(is_recipient){
		let state_code, state_name = "";
        if(is_recipient){
		    state_code = this.row.getCell(13).value;
            state_name = this.row.getCell(14).value;
        }else{
		    state_code = this.row.getCell(19).value;
            state_name = this.row.getCell(20).value;
        }
		let state = new State(state_code, state_name);
		dao.insertState(state);
    }
    insertDistrict(is_recipient){
        let district_num = 0 
        let state_code = "";
        if(is_recipient){
            district_num = this.row.getCell(16).value;
            state_code = this.row.getCell(13).value;
        }else{
            district_num = this.row.getCell(22).value;
            state_code = this.row.getCell(19).value;
        }
        let district = new District(district_num, state_code);
        dao.insertDistrict(district);
    }
    insertPlaceOfPerformance(){
        let pop_city = this.row.getCell(17).value;
        let pop_county = this.row.getCell(18).value;
        let pop_statecode = this.row.getCell(19).value;
        let pop_zip = this.row.getCell(21).value;
        let pop_district = this.row.getCell(22).value;
        this.insertState(false);
        this.insertDistrict(false);
        
        let placeofperformance = new PlaceOfPerformance(pop_city, pop_county, pop_statecode, pop_zip, pop_district);
        dao.insertPlace(placeofperformance);
    }
    insertParentAwardAgency(){
        let parent_name = this.row.getCell(2).value;

        let parentawardagency = new ParentAwardAgency("",parent_name);
        dao.insertParentAward(parentawardagency);
    }
    insertRecipient(){
        let name = row.getCell(6).value; 
        let addr = row.getCell(10).value; 
        let addr2 = row.getCell(11).value; 
        let city = row.getCell(12).value; 
        let state_code = row.getCell(13).value; 
        let zip = row.getCell(15).value; 
        let parent = row.getCell(7).value;

        let recipient = new Recipient("", name, addr, addr2, city, state_code, zip, parent);
        dao.insertRecipient(recipient);
    }

    insertAward(){
        let fiscal_year = row.getCell(42).value; 
        let recipient_id = recipient.id 
        let current_total = row.getCell(4).value;
        let potential_total = row.getCell(5).value; 
        let awarding_agency = row.getCell(2).value; 
        let awarding_office = row.getCell(8).value; 
        let funding_office = row.getCell(9).value;

        let award = new Award("", fiscal_year, recipient_id, current_total, potential_total, awarding_agency, awarding_office, funding_office);
        dao.insertAward(award);
    }
}

module.exports = RowParser;