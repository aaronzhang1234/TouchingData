/* ****************** MAIN.JS ******************
 * 2019 September 24 : Nathan Reiber : import Awards
 * 2019 September 23 : Nathan Reiber : use Dao, validate data migrate to award
 * 2019 September 22 : Aaron Zhang   : Created
 ********************************************
 * Purpose : Reads an excel spreadsheet and migrates the data to SQL using the sqlConnectInsert class.
 *
 */

var DataMigrator = require("./DataMigrator.js");

dataMigrator = new DataMigrator();

dataMigrator.migrateData();
