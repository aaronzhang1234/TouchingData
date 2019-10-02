/* ************* ParentAwardAgency *************
 * 2019 September 28 : Nathan Reiber : created
 * *********************************************
 * Purpose : defines a class named ParentAwardAgency to contain a PG1_PARENT_AWARD_AGENCY record
 *
*/

 class ParentAwardAgency {
	constructor(id = "", name=""){
		this.id = id
		this.name = name
	}
} 

module.exports = ParentAwardAgency;
