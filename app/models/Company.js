/* ****************** Company ******************
 * 2019 September 22 : Nathan Reiber : Created
 * *********************************************
 * Purpose : defines a class named Company to contain a Company record
 *
*/

class Company {
	constructor(id, name, addr1, addr2, city, state, zip, district, website){
		this.id = id; 
		this.name = name; 
		this.addr1 = addr1; 
		this.addr2 = addr2; 
		this.city = city; 
		this.state = state; 
		this.zip = zip; 
		this.district = district;
		this.website  = website;
	}
}

>>>>>>> 4da0fd519862c15b29e46f8428dae7b08f9714c8
module.exports = Company;
