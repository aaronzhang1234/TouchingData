/* ************* RecipientParent *************
 * 2019 September 28 : Nathan Reiber : created
 * *********************************************
 * Purpose : defines a class named RecipientParent to contain a PG1_RECIPIENT_PARENT record
 *
*/

 class RecipientParent {
	constructor(id = null, name=null){
		this.id = id
		this.name = name
	}
} 

module.exports = RecipientParent;
