-- 2019 September 22 : Justin Delisi : added PG1_MEDIA table definition
-- 2019 September 20 : Nathan Reiber : created
-------------------------------------------------------------------------------
-- purpose: this file contains all table definitions for the Politics of the Grid db
--

-- company table pulls data related to awardees from xlsx provided by Prof. Rajko
DROP TABLE IF EXISTS `PG1_COMPANY`; 
CREATE TABLE `PG1_COMPANY`(
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	addr1 TEXT,
	addr2 TEXT,
	city TEXT,
	state TEXT,
	zip TEXT,
	congressionalDistrict INTEGER
);


-- Media table contains metadata, including filepath, about media scraped from the web.
DROP TABLE IF EXISTS `PG1_MEDIA`;
CREATE TABLE `PG1_MEDIA`(
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	filePath TEXT NOT NULL, 
	fileType TEXT NOT NULL,
	description TEXT,
	medLength real,
  	source TEXT,
	compId INTEGER NOT NULL,
	FOREIGN KEY(compId) REFERENCES PG1_COMPANY(id)
);

-- AWARD table contains data about financial awards given by ICE to various company in the company table 
DROP TABLE IF EXISTS `PG1_AWARD`;
CREATE TABLE `PG1_AWARD`(
	piid INTEGER NOT NULL PRIMARY KEY, -- pull from spreadsheet
	compId INTEGER NOT NULL,
	currentTotal REAL NOT NULL,
	potentialTotal REAL NOT NULL,
	parentAwardAgency TEXT,
	awardingAgency TEXT,
	awardingOffice TEXT,
	fundingOffice TEXT,
	fiscalYear TEXT,
	FOREIGN KEY(compId) REFERENCES PG1_COMPANY(id)
);
