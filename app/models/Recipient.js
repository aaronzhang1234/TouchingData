/* ***************** Recipient *****************
 * 2019 September 28 : Nathan Reiber : update for DB v2
 * 2019 September 24 : Nathan Reiber : add website field
 * 2019 September 22 : Nathan Reiber : Created
 * *********************************************
 * Purpose : defines a class named Company to contain a Company record
 *
*/

class Company {
	constructor(id = null, name= null, addr1= null, addr2= null, city= null, state= null, zip= null, parent=null, congressionalDistrict= null, website= null, placeOfPerformance= null){
		this.id = id; 
		this.name = name; 
		this.addr1 = addr1; 
		this.addr2 = addr2; 
		this.city = city; 
		this.state = state; 
		this.zip = zip; 
		this.parent = parent; 
		this.congressionalDistrict = congressionalDistrict;
		this.website  = website;
		this.placeOfPerformance = placeOfPerformance;
	}
}

module.exports = Company;