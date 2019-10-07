/* ******************* State *******************
 * 2019 September 28 : Nathan Reiber : created
 * *********************************************
 * Purpose : defines a class named State to contain a PG1_STATE record
 *
*/

class State { // id of this class is official two letter state code
	constructor(id = null, name=null){
		this.id = id
		this.name = name
	}
} 

module.exports = State;
