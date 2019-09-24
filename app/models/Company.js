/* ****************** Company ******************
 * 2019 September 22 : Nathan Reiber : Created
 * *********************************************
 * Purpose : defines a class named Company to contain a Company record
 *
*/

class Company {
	constructor(id, name, addr1, addr2, city, state, zip, district){
		this.id = id; 
		this.name = name; 
		this.addr1 = addr1; 
		this.addr2 = addr2; 
		this.city = city; 
		this.state = state; 
		this.zip = zip; 
		this.district = district;
	}
}
module.exports = Company;
