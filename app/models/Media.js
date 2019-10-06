/* ****************** Company ******************
 * 2019 September 28 : Nathan Reiber : update for DB v2
 * 2019 September 23 : Nathan Reiber : Set default values
 * 2019 September 22 : Nathan Reiber : Created
 * *********************************************
 * Purpose : defines a class named Media to contain a Media record
 *
*/

 class Media {
	constructor(id = "", recipient = "" , filePath = "", fileType = "", description = "", source = "", url="", website=""){
		this.id = id; 
		this.recipient = recipient; 
		this.filePath = filePath; 
		this.fileType = fileType; 
		this.description = description; 
		this.source = source; 
		this.url = url; 
		this.website = website; 
	}
}


module.exports = Media;
