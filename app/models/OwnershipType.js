/* *************** OwnershipType ***************
 * 2019 September 28 : Nathan Reiber : created
 * *********************************************
 * Purpose : defines a class named OwnershipType to contain a PG1_OWNERSHIP_TYPE record
 *
*/

 class OwnershipType {
	constructor(id = null, description=null){
		this.id = id;
		this.description = description;
	}
} 

module.exports = OwnershipType;
