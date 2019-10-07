/* ****************** Website *****************
 * 2019 September 28 : Nathan Reiber : created
 * *********************************************
 * Purpose : defines a class named Website to contain a Website record
 *
*/

 class Website {
	constructor(id = null, domain=null){
		this.id = id
		this.domain = domain
	}
} 

module.exports = Website;
