/* ****************** Company ******************
 * 2019 September 28 : Nathan Reiber : update for DB v2
 * 2019 September 23 : Nathan Reiber : Set default values
 * 2019 September 22 : Nathan Reiber : Created
 * *********************************************
 * Purpose : defines a class named Media to contain a Media record
 *
*/

class Media {
	constructor(
		id = null,
		recipient = null,
		filePath = null,
		fileType = null,
		description = null,
		url=null, 
		website=null,
		parentKey=null,
		usable=null,
		kind=null
	){
		this.id = id; 
		this.recipient = recipient; 
		this.filePath = filePath; 
		this.fileType = fileType; 
		this.description = description; 
		this.url = url; 
		this.website = website; 
		this.parentKey = parentKey; 
		this.usable = usable; 
		this.kind = kind;
	}
}


module.exports = Media;
