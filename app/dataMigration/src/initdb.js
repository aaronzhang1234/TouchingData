/* ****************** initDb ******************
 * 2019 October 01 : Nathan Reiber  : Created
 ********************************************
 * Purpose : drop and create all tables
 */

DbBuilder = require('./DbBuilder.js')
DataMigrator = require('./DataMigrator.js')

dbBuilder = new DbBuilder();
dataMigrator = new DataMigrator();

dbBuilder.buildDb();
dataMigrator.migrateData();


