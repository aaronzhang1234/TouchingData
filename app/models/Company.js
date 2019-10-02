/* ****************** Company ******************
 * 2019 September 24 : Nathan Reiber : add website field
 * 2019 September 22 : Nathan Reiber : Created
 * *********************************************
 * Purpose : defines a class named Company to contain a Company record
 *
*/

class Company {
	constructor(id = "", name= "", addr1= "", addr2= "", city= "", state= "", zip= "", congressionalDistrict= "", website= ""){
		this.id = id; 
		this.name = name; 
		this.addr1 = addr1; 
		this.addr2 = addr2; 
		this.city = city; 
		this.state = state; 
		this.zip = zip; 
		this.congressionalDistrict = congressionalDistrict;
		this.website  = website;
	}
}

module.exports = Company;