/* ****************** Company ******************
 * 2019 September 22 : Nathan Reiber : Created
 * *********************************************
 * Purpose : defines a class named Award to contain an Awarad record
 *
*/

 class Award {
	constructor(piid, compId, currentTotal, potentialTotal, parentAwardAgency, awardingAgency, awardingOffice, fundingOffice, fiscalYear){
		this.piid = piid; 
		this.compId = compId; 
		this.currentTotal = currentTotal; 
		this.potentialTotal = potentialTotal; 
		this.parentAwardAgency = parentAwardAgency; 
		this.awardingAgency = awardingAgency; 
		this.awardingOffice = awardingOffice; 
		this.fundingOffice = fundingOffice; 
		this.fiscalYear = fiscalYear; 
	}
}

module.exports = Award;
