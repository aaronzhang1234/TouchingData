/* ***************** District ******************
 * 2019 September 28 : Nathan Reiber : created
 * *********************************************
 * Purpose : defines a class named District to contain a PG1_CONGRESSIONAL_DISTRICT record
 *
*/

class District {  // id represents the district number)
	constructor(id = null, state=null){
		this.id = id
		this.state = state
	}
} 

module.exports = District;
