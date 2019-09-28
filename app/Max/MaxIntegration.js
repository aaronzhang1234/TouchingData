//Justin Delisi - MaxIntegration.js

//global variables for max to know number of inlets and outlets
inlets = 1;
outlets = 4;
//require Max integration variables
var sqlite = new SQLite;
var result = new SQLResult;
//counter
var i = 0;

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
function getData()
{
    //execute sql statement in sqlite max msp integration
    sqlite.exec("SELECT name FROM pg1_Company WHERE name = 'ATLANTIC DIVING SUPPLY, INC.'", result);
    //output to max
    outlet(0, result.value(0,0));

    //execute sql statement in sqlite max msp integration
    sqlite.exec("SELECT filePath FROM pg1_media a JOIN Pg1_company c WHERE a.compId = c.id AND c.name = 'ATLANTIC DIVING SUPPLY, INC.'", result);
    //output to max
    outlet(1, result.value(0,0));

    //get award sql statement
    //execute sql statement in sqlite max msp integration
    sqlite.exec("SELECT currentTotal FROM pg1_award a JOIN Pg1_company c WHERE a.compId = c.id AND c.name = 'ATLANTIC DIVING SUPPLY, INC.' ORDER BY currentTotal ASC", result);
    //output to max
    outlet(2, parseInt(result.value(0,i),10));
    if(i == result.numrecords())
    {
        outlet(3, 'bang');
        i = 0;
    }
        
    else
        i++; 
}

//close the database
function closeDb(){
    sqlite.close();
}