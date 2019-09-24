/* ****************** Company ******************
 * 2019 September 22 : Nathan Reiber : Created
 * *********************************************
 * Purpose : defines a class named Company to contain a Company record
 *
*/

<<<<<<< HEAD
 class Company {
	constructor(id, name, addr1, addr2, city, state, zip, district){
=======
class Company {
	constructor(id, name, addr1, addr2, city, state, zip, district, website){
>>>>>>> afc5184759699ac168816420d9be008ce78548c2
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

module.exports = Company;
