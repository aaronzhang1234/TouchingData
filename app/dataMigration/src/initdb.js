var Dao = require("../../DAO.js");
let sqlDatabaseName = "data/POLITICS_OF_THE_GRID.db";
var dao = new Dao(sqlDatabaseName);

var childProcess = require('child_process');

dao.dropAllTables();
dao.createAllTables();

runScript("app/dataMigration/src/initValidationTables.js", function(err){
	if (err)throw err;
	console.log('finished running validation init' );
});

runScript("app/dataMigration/src/main.js", function(err){
	if (err)throw err;
	console.log('finished running mig');
});

function runScript(scriptPath, callback){
	var invoked = false;
	var process = childProcess.fork(scriptPath);
	process.on('error', function(err){
		if(invoked)return;
		invoked = true;
		callback(err);
	});

	process.on('exit', function(code){
		if(invoked)return;
		invoked = true;
		var err = code === 0 ? null : new Error('exit code' + code);
		callback(err);
	});
}


