CREATE TABLE sqlite_sequence(name,seq);
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
CREATE INDEX idxCompanyId
ON PG1_COMPANY(id);
CREATE INDEX idxCompanyName
ON PG1_COMPANY(name);
CREATE INDEX idxMediaId
ON PG1_MEDIA(id);
CREATE INDEX idxMediaCompId
ON PG1_MEDIA(compId);
CREATE INDEX idxAwardId
ON PG1_AWARD(piid);
CREATE INDEX idxAwardCompId
ON PG1_AWARD(compId);
