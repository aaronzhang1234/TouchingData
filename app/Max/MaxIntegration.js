//Justin Delisi - MaxIntegration.js
//global variables for max to know number of inlets and outlets
inlets = 1;
outlets = 5;
//for debugging purposes
var objectPrinter = require("jm.objectPrinter");
//require Max integration variables
var sqlite = new SQLite;
var nameResult = new SQLResult;
var countResult = new SQLResult;
var mediaResult = new SQLResult;
//counter
var i = 0;

//sqlstatement as a string
var recipientSqlStatement = "";
var mediaSqlStatement = "";
var countSqlStatement = "";

//absolute path to the project
var path = "/Users/jessicarajko/Workspace/TouchingData/";

//open the database at the db Filepath provided
function opendb(dbFilePath)
{
    sqlite.open(dbFilePath, 1);
}

//resets the counter when project is reset
function resetCounter()
{
    i = 0;
}

//outputs all to max msp
function getRecipientName(min, max, aggregation)
{
    //execute sql statement in sqlite max msp integration
    //get each company getting award amount between min and max 
    if(aggregation == 0)    
        recipientSqlStatement = "select DISTINCT R.RECIPIENT_NAME, R.Recipient_id from PG1_AWARD A join PG1_RECIPIENT R WHERE A.recipient_id = R.recipient_id AND A.current_total_value_of_award BETWEEN "+ min + " and " + max + " ORDER BY R.Recipient_name limit 1 offset " + i;
    else if(aggregation == 1)
        recipientSqlStatment = "select r.recipient_name from pg1_recipient r join (select a.recipient_id, sum(a.current_total_value_of_award)as summation from pg1_award agroup by a.recipient_id)n where r.recipient_id = n.recipient_id and n.summation between " + min + " and " + max + " order by r.recipient_name limit 1 offset " + i;
	sqlite.exec(recipientSqlStatement, nameResult);
    getCount(min, max);
    //output to max
    post(nameResult.value(0,0) + "\n");
    if(nameResult.value(0,0) != 0)
    {
        outlet(0, nameResult.value(0,0));
        getMedia(recipientSqlStatement);
        i++;
    }
    else
    {
        outlet(3, 'bang');
        i = 0;
    } 
}

//output media file from recipient that has award between min and max
function getMedia(recipientSqlStatement)
{
	mediaSqlStatement = "SELECT M.filePath FROM PG1_Media M JOIN (" + recipientSqlStatement + ") N WHERE M.recipient_id = N.recipient_id and M.filePath != '' limit 1";
    sqlite.exec(mediaSqlStatement, mediaResult);
    //media file is found, send path to max
	if(mediaResult.value(0,0) != 0)
	{
		post(mediaResult.value(0,0));
		outlet(1, path + mediaResult.value(0,0));
    }
    //no media file found send bang to max to play a note
    else
        outlet(4, 'bang');
    
}

//get count of results of any sql statement passed in
function getCount(min, max)
{
    //get count of companies
    countsqlstatement = "select count(*) from (select distinct r.recipient_name from pg1_award a join pg1_recipient r where a.recipient_id = r.recipient_id and a.current_total_value_of_award between " + min + " and " + max + ")";
    sqlite.exec(countsqlstatement, countResult);
    outlet(2, parseInt(countResult.value(0,0)));
}

//close the database
function closeDb(){
    sqlite.close();
}


