/* ****************** Company ******************
 * 2019 September 22 : Nathan Reiber : Created
 * *********************************************
 * Purpose : defines a class named Media to contain a Media record
 *
*/

class Media {
	constructor(id, compId, filePath, fileType, description, medLength, source){
		this.id = id; 
		this.compId = compId; 
		this.filePath = filePath; 
		this.fileType = fileType; 
		this.description = description; 
		this.medLength = medLength; 
		this.source = source; 
	}
}

module.exports = Media;
