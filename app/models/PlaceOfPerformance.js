/* ****************** Company ******************
 * 2019 September 28 : Nathan Reiber : created
 * *********************************************
 * Purpose : defines a class named PlaceOfPerformance to contain an PG1_PLACE_OF_PERFORMANCE record
 *
*/

class PlaceOfPerformance {
	constructor(id = "", city = "", county = "", state="", zip = "", congressionalDistrict  = ""){
		this.id = id; 
		this.city = city; 
		this.county = county; 
		this.state = state; 
		this.zip = zip; 
		this.congressionalDistrict = congressionalDistrict; 
	}
}

module.exports = PlaceOfPerformance;