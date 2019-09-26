----------------------------pofg_schema.sql------------------------------------
-- 2019 September 26 : Nathan Reiber : added autoincrementing key to Award table
--																	 : removed NOT NULL constraint on various fields in Award table
-- 2019 September 22 : Justin Delisi : added PG1_MEDIA table definition
-- 2019 September 20 : Nathan Reiber : created
-------------------------------------------------------------------------------
-- purpose: this file contains all table definitions for the Politics of the Grid db
--

-- company table pulls data related to awardees from xlsx provided by Prof. Rajko
DROP TABLE IF EXISTS `PG1_COMPANY`; 
CREATE TABLE `PG1_COMPANY`(
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL UNIQUE,
	addr1 TEXT,
	addr2 TEXT,
	city TEXT,
	state TEXT,
	zip TEXT,
	congressionalDistrict INTEGER,
	website TEXT
);


-- Media table contains metadata, including filepath, about media scraped from the web.
DROP TABLE IF EXISTS `PG1_MEDIA`;
CREATE TABLE `PG1_MEDIA`(
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	compId INTEGER NOT NULL,
	filePath TEXT NOT NULL, 
	fileType TEXT NOT NULL,
	description TEXT,
	medLength real,
  source TEXT,
	FOREIGN KEY(compId) REFERENCES PG1_COMPANY(id)
);

-- AWARD table contains data about financial awards given by ICE to various company in the company table 
DROP TABLE IF EXISTS `PG1_AWARD`;
CREATE TABLE `PG1_AWARD`(
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	piid TEXT,
	compId INTEGER,
	currentTotal REAL,
	potentialTotal REAL,
	parentAwardAgency TEXT,
	awardingAgency TEXT,
	awardingOffice TEXT,
	fundingOffice TEXT,
	fiscalYear TEXT,
	FOREIGN KEY(compId) REFERENCES PG1_COMPANY(id)
);

-- PG1_COMPANY indexes
CREATE INDEX idxCompanyId
ON PG1_COMPANY(id);

CREATE INDEX idxCompanyName
ON PG1_COMPANY(name);

-- PG1_MEDIA indexes
CREATE INDEX idxMediaId
ON PG1_MEDIA(id);

CREATE INDEX idxMediaCompId
ON PG1_MEDIA(compId);

-- PG1_AWARD indexes
CREATE INDEX idxAwardId
ON PG1_AWARD(piid);

CREATE INDEX idxAwardCompId
ON PG1_AWARD(compId);
