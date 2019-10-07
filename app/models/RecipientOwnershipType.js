/* *************** RecipientOwnershipType ***************
 * 2019 September 28 : Nathan Reiber : created
 * *********************************************
 * Purpose : defines a class named RecipientOwnershipType to contain a PG1_RECIPIENT_OWNERSHIP_TYPE record
 *
*/

 class RecipientOwnershipType {
	constructor(ownershipType=null, recipient=null, notes=null){
		this.ownershipType = ownershipType;
		this.recipient = recipient;
		this.notes = notes;
	}
} 

module.exports = RecipientOwnershipType;
