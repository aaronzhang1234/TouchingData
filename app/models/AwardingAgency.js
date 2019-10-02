/* ************* AwardingAgency *************
 * 2019 September 28 : Nathan Reiber : created
 * *********************************************
 * Purpose : defines a class named AwardingAgency to contain a PG1_AWARDING_AGENCY record
 *
*/

 class AwardingAgency {
	constructor(id = "", name="", parent=""){
		this.id = id;
		this.name = name;
		this.parent = parent;
	}
} 

module.exports = AwardingAgency;
