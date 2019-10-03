/* ****************** Company ******************
 * 2019 September 26 : Nathan Reiber : update for DB v2
 * 2019 September 26 : Nathan Reiber : add id field for autoincrementing key
 * 2019 September 24 : Nathan Reiber : default values
 * 2019 September 22 : Nathan Reiber : Created
 * *********************************************
 * Purpose : defines a class named Award to contain an Awarad record
 *
*/

 class Award {
	constructor(piid = "", fiscalYear = "" ,recipient = "", currentTotal = "", potentialTotal = "", awardingAgency = "", awardingOffice = "", fundingOffice = ""){
		this.piid = piid; 
		this.fiscalYear = fiscalYear; 
		this.recipient = recipient; 
		this.currentTotal = currentTotal; 
		this.potentialTotal = potentialTotal; 
		this.awardingAgency = awardingAgency; 
		this.awardingOffice = awardingOffice; 
		this.fundingOffice = fundingOffice; 
	}
}

module.exports = Award;
