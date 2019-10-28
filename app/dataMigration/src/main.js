/* ****************** MAIN.JS ******************
 * 2019 September 24 : Nathan Reiber : import Awards
 * 2019 September 23 : Nathan Reiber : use Dao, validate data migrate to award
 * 2019 September 22 : Aaron Zhang   : Created
 ********************************************
 * Purpose : Script to run data migration process from Command line
 *
 */

var DataMigrator = require("./DataMigrator.js");

dataMigrator = new DataMigrator();

dataMigrator.migrateData();
