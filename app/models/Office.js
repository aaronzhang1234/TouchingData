/* ************** Office ***************
 * 2019 September 28 : Nathan Reiber : created
 * *********************************************
 * Purpose : defines a class named Office to contain a PG1_OFFICE record
 *
*/

 class Office {
	constructor(id = null, name=null){
		this.id = id;
		this.name = name;
	}
} 

module.exports = Office;
