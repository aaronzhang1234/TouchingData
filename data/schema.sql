CREATE TABLE `PG1_RECIPIENT`(
	recipient_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	recipient_name TEXT NOT NULL UNIQUE,
	recipient_address_line_1 TEXT,
	recipient_address_line_2 TEXT,
	recipient_city TEXT,
	recipient_state_code TEXT,
	recipient_zip_4_code TEXT,
	recipient_parent_id integer, 
	recipient_district_id integer,
	recipient_website_id TEXT,
	recipient_place_of_performance_id integer,
	FOREIGN KEY(recipient_district_id, recipient_state_code) REFERENCES PG1_CONGRESSIONAL_DISTRICT(district_id, state_code)
	FOREIGN KEY(recipient_state_code) REFERENCES PG1_STATE(state_code)
	FOREIGN KEY(recipient_place_of_performance_id) REFERENCES PG1_PLACE_OF_PERFORMANCE(place_of_performance_id)
);
CREATE TABLE `PG1_MEDIA`(
	media_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	recipient_id INTEGER NOT NULL,
	filePath TEXT NOT NULL, 
	fileType TEXT NOT NULL,
	description TEXT,
  	source TEXT,
	url TEXT,
	website_id integer,
	FOREIGN KEY(recipient_id) REFERENCES PG1_REPIENT(recipient_id),
	FOREIGN KEY(website_id) REFERENCES PG1_WEBSITE(website_id)
);
CREATE TABLE `PG1_AWARD`(
	award_id_piid INTEGER NOT NULL,
	recipient_id INTEGER,
	current_total_value_of_award REAL,
	potential_total_value_of_award REAL,
	awarding_agency_id integer,
	awarding_office_id integer,
	funding_office_id TEXT,
	fiscal_year TEXT,
	FOREIGN KEY(recipient_id) REFERENCES PG1_RECIPIENT(recipient_id),
	FOREIGN KEY(awarding_office_id) REFERENCES PG1_OFFICE(office_id),
	FOREIGN KEY(funding_office_id) REFERENCES PG1_OFFICE(office_id),
	FOREIGN KEY(awarding_agency_id) REFERENCES PG1_AWARDING_AGENCY(awarding_agency_id),
	PRIMARY KEY(award_id_piid,fiscal_year)
);
CREATE TABLE `PG1_PLACE_OF_PERFORMANCE`(
	place_of_performance_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	place_of_performance_city TEXT,
	place_of_performance_zip TEXT,
	place_of_performance_county TEXT,
	place_of_performance_state_code TEXT,
	place_of_performance_district_id TEXT,
	UNIQUE(place_of_performance_city, place_of_performance_zip),
	FOREIGN KEY(place_of_performance_district_id, place_of_performance_state_code) REFERENCES PG1_CONGRESSIONAL_DISTRICT(district_id, state_code)
);
CREATE TABLE `PG1_AWARDING_AGENCY`(
	awarding_agency_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	awarding_agency_name TEXT UNIQUE,
	parent_award_agency_id integer,
	FOREIGN KEY(parent_award_agency_id) REFERENCES PG1_PARENT_AWARD_AGENCY(parent_award_agency_id)
);
CREATE TABLE `PG1_PARENT_AWARD_AGENCY`(
	parent_award_agency_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	parent_awarding_agency_name integer UNIQUE
);
CREATE TABLE `PG1_OFFICE`(
	office_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	office_name TEXT UNIQUE
);
CREATE TABLE `PG1_STATE`(
	state_code TEXT NOT NULL PRIMARY KEY,
	state_name TEXT
);
CREATE TABLE `PG1_CONGRESSIONAL_DISTRICT`(
	district_id INTEGER NOT NULL,
	state_code INTEGER,
	PRIMARY KEY(district_id,state_code)
);
CREATE TABLE `PG1_WEBSITE`(
	website_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	website_domain TEXT UNIQUE
);
CREATE TABLE `PG1_RECIPIENT_OWNERSHIP_TYPE`(
	ownership_type_id TEXT NOT NULL,
	recipient_id INTEGER NOT NULL,
	recipient_ownership_notes TEXT,
	PRIMARY KEY(ownership_type_id,recipient_id)
	FOREIGN KEY(recipient_id) REFERENCES PG1_RECIPIENT(recipient_id)
	FOREIGN KEY(ownership_type_id) REFERENCES PG1_OWNERSHIP_TYPE(ownership_type_id)
);
CREATE TABLE `PG1_OWNERSHIP_TYPE`(
	ownership_type_id TEXT NOT NULL PRIMARY KEY,
	ownership_type_description TEXT 
);
CREATE TABLE `PG1_RECIPIENT_PARENT`(
	recipient_parent_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	recipient_parent_name TEXT UNIQUE
);
CREATE INDEX idx_media_recipient_id
ON PG1_MEDIA(recipient_id);
CREATE INDEX idx_award_id
ON PG1_AWARD(award_id_piid, fiscal_year);
CREATE INDEX idx_award_piid
ON PG1_AWARD(award_id_piid);
CREATE INDEX idx_award_recipient_id
ON PG1_AWARD(recipient_id);
