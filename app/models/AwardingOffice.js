/* ************** AwardingOffice ***************
 * 2019 September 28 : Nathan Reiber : created
 * *********************************************
 * Purpose : defines a class named AwardingOffice to contain a PG1_AWARDING_OFFICE record
 *
*/

 class AwardingOffice {
	constructor(id = "", name=""){
		this.id = id;
		this.name = name;
	}
} 

module.exports = AwardingOffice;
