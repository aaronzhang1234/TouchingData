/* ************** FundingOffice ***************
 * 2019 September 28 : Nathan Reiber : created
 * *********************************************
 * Purpose : defines a class named FundingOffice to contain a PG1_FUNDING_OFFICE record
 *
*/

 class FundingOffice {
	constructor(id = "", name=""){
		this.id = id;
		this.name = name;
	}
} 

module.exports = FundingOffice;
