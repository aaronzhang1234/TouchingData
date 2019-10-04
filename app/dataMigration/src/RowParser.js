var Dao     = require("../../DAO.js");
let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
var dao = new Dao(sqlDatabaseName);


let ParentAwardAgency = require("../../models/ParentAwardAgency");
let AwardingAgency = require("../../models/AwardingAgency");
let PlaceOfPerformance = require("../../models/PlaceOfPerformance");
let Recipient = require("../../models/Recipient.js");
let Award = require("../../models/Award.js");
let RecipientParent = require("../../models/RecipientParent.js");
class RowParser{
    constructor(row){
        this.row = row
    }
    //complete
    insertParentAwardAgency(){
        let parent_name = this.row.getCell(2).value;

        let parentawardagency = new ParentAwardAgency("",parent_name);
        dao.insertParentAward(parentawardagency);
    }
    //need parentAwardAgency ID
    insertAwardingAgency(){
        let agency_name = this.row.getCell(3).value;

        let awardingagency = new AwardingAgency("", agency_name, parent_name);
        dao.insertAwardingAgency(awardingagency);
    }
    //complete
    insertPlaceOfPerformance(){
        let pop_city = this.row.getCell(17).value;
        let pop_county = this.row.getCell(18).value;
        let pop_statecode = this.row.getCell(19).value;
        let pop_zip = Math.round(this.row.getCell(21).value);
        let pop_district = Math.round(this.row.getCell(22).value);
    
        let placeofperformance = new PlaceOfPerformance("", pop_city, pop_county, pop_statecode, pop_zip, pop_district);
        dao.insertPlace(placeofperformance);
    }
    //complete enough
    insertRecipientParent(){
        let parent_name = this.row.getCell(7).value;
        
        let recipientparent = new RecipientParent("", parent_name);
        dao.insertRecParent(recipientparent);
    }
    //need place of performance id
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
    // need awardingoffice, funding office, awarding agency id
    insertAward(){
        let fiscal_year = row.getCell(42).value; 
        //get recipient id   
        let current_total = row.getCell(4).value;
        let potential_total = row.getCell(5).value; 
        //get awarding_agency id
        //get awarding office id
        //get funding office id

        let award = new Award("", fiscal_year, recipient_id, current_total, potential_total, awarding_agency, awarding_office, funding_office);
        dao.insertAward(award);
    }
}

module.exports = RowParser;