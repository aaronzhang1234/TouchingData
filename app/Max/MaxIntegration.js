//Justin Delisi - MaxIntegration.js
//global variables for max to know number of inlets and outlets
inlets = 1;
outlets = 7;
//for debugging purposes
var objectPrinter = require("jm.objectPrinter");
//require Max integration variables
var sqlite = new SQLite;
var nameResult = new SQLResult;
var countResult = new SQLResult;
var mediaResult = new SQLResult;
var recipientListResult = new SQLResult;
var mediaListResult = new SQLResult;
var result = new SQLResult;
//counters
var i = 0;

//sqlstatement as a string
var recipientSqlStatement = "";
var recipientListSqlStatement = "";
var mediaSqlStatement = "";
var mediaListSqlStatement = "";
var countSqlStatement = "";
var demographicsSqlStatement = "";

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

//get list of recipients matching user choosen criteria
function getRecipientList(min, max, aggregation, race, race2, gender, veteran, mediaType)
{
    //send demographics to start building sql statement
    demographicSqlstament = buildSQLStatement(race, race2, gender, veteran);
    //execute sql statement in sqlite max msp integration
    //get each company getting award amount between min and max 
    if (demographicsSqlStatement == "false")
    {
        //get recipient name based on individual awards
        if(aggregation == 0)
        {
            recipientListSqlStatement = "select DISTINCT R.RECIPIENT_NAME, R.Recipient_id \
                                from PG1_AWARD A join PG1_RECIPIENT R \
                                WHERE A.recipient_id = R.recipient_id AND A.current_total_value_of_award BETWEEN "+ min + " and " + max + 
                                " ORDER BY R.Recipient_name";
        } 
        //get recipient name based on summation of awards   
        else if(aggregation == 1)
        {
            recipientListSqlStatement = "select r.recipient_name, r.recipient_id \
                                from pg1_recipient r join \
                                (select a.recipient_id, sum(a.current_total_value_of_award) as summation \
                                from pg1_award a group by a.recipient_id) n \
                                where r.recipient_id = n.recipient_id and n.summation between " + min + " and " + max + 
                                " order by r.recipient_name";
        }
    }
    else
    {
        //get recipient name based on individual awards with demographics
        if(aggregation == 0)
        {
            recipientListSqlStatement = "select DISTINCT R.RECIPIENT_NAME, R.Recipient_id \
                                from PG1_AWARD A join PG1_RECIPIENT R join ("+ demographicsSqlStatement +") O\
                                WHERE A.recipient_id = R.recipient_id AND R.recipient_id = O.recipient_id \
                                AND A.current_total_value_of_award BETWEEN "+ min + " and " + max + 
                                " ORDER BY R.Recipient_name";
        } 
        //get recipient name based on summation of awards with demographics   
        else if(aggregation == 1)
        {
            recipientListSqlStatement = "select r.recipient_name, r.recipient_id \
                                from pg1_recipient r join \
                                (select a.recipient_id, sum(a.current_total_value_of_award) as summation \
                                from pg1_award a group by a.recipient_id) n join (" + demographicsSqlStatement + ") O\
                                where r.recipient_id = n.recipient_id and n.recipient_id = O.recipient_id and n.summation between " + min + " and " + max + 
                                " order by r.recipient_name";
        }
    }
    //execute the sql statement
    sqlite.exec(recipientListSqlStatement, recipientListResult);
    if(recipientListResult.value(0,0) != 0)
    {
        //get list of media based on the recipients found
        getMediaList(recipientListSqlStatement, mediaType);
    }

}

function getMediaList(recipientListSqlStatement, mediaType)
{
    var counter = 0;
    var list = "";
    //mediaType = 0 is for all media
    if(mediaType == 0)
    {
        mediaListSqlStatement = "SELECT M.filePath \
        FROM PG1_Media M JOIN (" + recipientListSqlStatement + ") N \
        WHERE M.recipient_id = N.recipient_id and M.filePath != '' and M.fileType != 'txt'";
    }
    //mediaType = 1 is for just videos
    else if (mediaType == 1)
    {
        mediaListSqlStatement = "SELECT M.filePath \
        FROM PG1_Media M JOIN (" + recipientListSqlStatement + ") N \
        WHERE M.recipient_id = N.recipient_id and M.filePath != '' and M.fileType != 'txt' and M.fileType != 'wav'";
    }
    //mediaType = 2 is for just text to audio
    else if (mediaType == 2)
    {
        mediaListSqlStatement = "SELECT M.filePath \
        FROM PG1_Media M JOIN (" + recipientListSqlStatement + ") N \
        WHERE M.recipient_id = N.recipient_id and M.filePath != '' and M.fileType = 'wav'";
    }
    sqlite.exec(mediaListSqlStatement, mediaListResult);
    //output to the list
    while(mediaListResult.value(0,counter) != 0)
    {
        list += mediaListResult.value(0, counter) + " ";
        counter++;
    }
    outlet(6,list);
}

//build SQL statement for demographics selected
function buildSQLStatement(race, race2, gender, veteran)
{
    demographicsSqlStatement = "false";
    if(race != 0 || race2 != 0 || gender != 0 || veteran !=0)
    {
        demographicsSqlStatement = getDemographics(race, race2, gender, veteran);
    }
    return demographicsSqlStatement;
}

//get demographics sql statement based on selections from max
function getDemographics(race, race2, gender, veteran)
{
    //make an array of the different demographics to build sql statement
    var demographicArray = [];
    if(race != 0)
    {
        switch(race)
        {
            case 1: 
                demographicArray.push("alaskan_native_owned_corporation_or_firm");
                break;
            case 2:
                demographicArray.push("american_indian_owned_business");
                break;
            case 3:
                demographicArray.push("asian_pacific_american_owned_business");
                break;
            case 4:
                demographicArray.push("black_american_owned_business");
                break;
            case 5:
                demographicArray.push("hispanic_american_owned_business");
                break;
            case 6:
                demographicArray.push("native_american_owned_business");
                break;
            case 7:
                demographicArray.push("native_hawaiian_owned_business");
                break;
            case 8:
                demographicArray.push("other_minority_owned_business");
                break;
        }
    }
    if(race2 != 0)
    {
        switch(race2)
        {
            case 1: 
                demographicArray.push("alaskan_native_owned_corporation_or_firm");
                break;
            case 2:
                demographicArray.push("american_indian_owned_business");
                break;
            case 3:
                demographicArray.push("asian_pacific_american_owned_business");
                break;
            case 4:
                demographicArray.push("black_american_owned_business");
                break;
            case 5:
                demographicArray.push("hispanic_american_owned_business");
                break;
            case 6:
                demographicArray.push("native_american_owned_business");
                break;
            case 7:
                demographicArray.push("native_hawaiian_owned_business");
                break;
            case 8:
                demographicArray.push("other_minority_owned_business");
                break;
        }
    }
    if(gender !=0)
    {
        switch(gender)
        {
            case 1:
                demographicArray.push("woman_owned_business");
                break;
            case 2:
                demographicArray.push("women_owned_small_business");
                break;
            case 3:
                demographicArray.push("economically_disadvantaged_women_owned_small_business");
                break;
            case 4:
                demographicArray.push("joint_venture_women_owned_small_business");
                break;
            case 5:
                demographicArray.push("joint_venture_economic_disadvantaged_women_owned_small_business");
                break;
        }
    }
    if(veteran !=0)
    {
        switch(veteran)
        {
            case 1:
                demographicArray.push("veteran_owned_business");
                break;
            case 2:
                demographicArray.push("service_disabled_veteran_owned_business");
                break;
        }
    }
    if(demographicArray.length == 1)
    {
        demographicsSqlStatement = "select recipient_id\
        from pg1_recipient_ownership_type\
        where ownership_type_id = '"+ demographicArray[0] + "'";
    }
    else if(demographicArray.length == 2)
    {
        demographicsSqlStatement = "select A.recipient_id\
        from pg1_recipient_ownership_type A, pg1_recipient_ownership_type B\
        where A.recipient_id = B.recipient_id\
        AND A.ownership_type_id = '"+ demographicArray[0] + "'\
        AND B.ownership_type_id = '" + demographicArray[1] + "'";
    }
    else if(demographicArray.length == 3)
    {
        demographicsSqlStatement = "select A.recipient_id\
        from pg1_recipient_ownership_type A, pg1_recipient_ownership_type B, pg1_recipient_ownership_type C\
        where A.recipient_id = B.recipient_id \
        AND B.recipient_id = C.recipient_id\
        AND A.ownership_type_id = '"+ demographicArray[0] + "'\
        AND B.ownership_type_id = '"+ demographicArray[1] + "'\
        AND C.ownership_type_id = '"+ demographicArray[2] + "'";
    }
    else if(demographicArray.length == 4)
    {
        demographicsSqlStatement = "select A.recipient_id\
        from pg1_recipient_ownership_type A, pg1_recipient_ownership_type B, pg1_recipient_ownership_type C, pg1_recipient_ownership_type D\
        where A.recipient_id = B.recipient_id \
        AND B.recipient_id = C.recipient_id\
        AND C.recipient_id = D.recipient_id\
        AND A.ownership_type_id = '"+ demographicArray[0] + "'\
        AND B.ownership_type_id = '"+ demographicArray[1] + "'\
        AND C.ownership_type_id = '"+ demographicArray[2] + "'\
        AND D.ownership_type_id = '"+ demographicArray[3] + "'";
    }
    
    return demographicsSqlStatement;
}

//outputs all to max msp
function getRecipientName(min, max, aggregation, race, race2, gender, veteran, list, mediaType)
{
    //if list = 1 get list and bypass rest of art installation
    if(list == 1)
    {
        getRecipientList(min, max, aggregation, race, race2, gender, veteran, mediaType);
        return;
    }
    //send demographics to start building sql statement
    demographicSqlstament = buildSQLStatement(race, race2, gender, veteran);
    //execute sql statement in sqlite max msp integration
    //get each company getting award amount between min and max 
    if (demographicsSqlStatement == "false")
    {
        //get recipient name based on individual awards
        if(aggregation == 0)
        {
            recipientSqlStatement = "select DISTINCT R.RECIPIENT_NAME, R.Recipient_id \
                                from PG1_AWARD A join PG1_RECIPIENT R \
                                WHERE A.recipient_id = R.recipient_id AND A.current_total_value_of_award BETWEEN "+ min + " and " + max + 
                                " ORDER BY R.Recipient_name limit 1 offset " + i;
        } 
        //get recipient name based on summation of awards   
        else if(aggregation == 1)
        {
            recipientSqlStatement = "select r.recipient_name, r.recipient_id \
                                from pg1_recipient r join \
                                (select a.recipient_id, sum(a.current_total_value_of_award) as summation \
                                from pg1_award a group by a.recipient_id) n \
                                where r.recipient_id = n.recipient_id and n.summation between " + min + " and " + max + 
                                " order by r.recipient_name limit 1 offset " + i;
        }
    }
    else
    {
        //get recipient name based on individual awards with demographics
        if(aggregation == 0)
        {
            recipientSqlStatement = "select DISTINCT R.RECIPIENT_NAME, R.Recipient_id \
                                from PG1_AWARD A join PG1_RECIPIENT R join ("+ demographicsSqlStatement +") O\
                                WHERE A.recipient_id = R.recipient_id AND R.recipient_id = O.recipient_id \
                                AND A.current_total_value_of_award BETWEEN "+ min + " and " + max + 
                                " ORDER BY R.Recipient_name limit 1 offset " + i;
        } 
        //get recipient name based on summation of awards with demographics   
        else if(aggregation == 1)
        {
            recipientSqlStatement = "select r.recipient_name, r.recipient_id \
                                from pg1_recipient r join \
                                (select a.recipient_id, sum(a.current_total_value_of_award) as summation \
                                from pg1_award a group by a.recipient_id) n join (" + demographicsSqlStatement + ") O\
                                where r.recipient_id = n.recipient_id and n.recipient_id = O.recipient_id and n.summation between " + min + " and " + max + 
                                " order by r.recipient_name limit 1 offset " + i;
        }
    }
    
	sqlite.exec(recipientSqlStatement, nameResult);
    getCount(min, max, aggregation, demographicsSqlStatement);
    //output to max
    if(nameResult.value(0,0) != 0)
    {
        outlet(0, nameResult.value(0,0));
        outlet(5, i);
        getMedia(recipientSqlStatement, mediaType);
        i++;
    }
    else
    {
        //bang to indicate list is complete
        outlet(3, 'bang');
        i = 0;
    } 
}

//output media file from recipient that has award between min and max
function getMedia(recipientSqlStatement, mediaType)
{
    //get all media
    if(mediaType == 0)
    {
        mediaSqlStatement = "SELECT M.filePath FROM PG1_Media M JOIN (" + recipientSqlStatement + ") N WHERE M.recipient_id = N.recipient_id and M.filePath != '' and M.fileType != 'txt' limit 1";
    }
    //get just videos
    else if (mediaType == 1)
    {
        mediaSqlStatement = "SELECT M.filePath FROM PG1_Media M JOIN (" + recipientSqlStatement + ") N WHERE M.recipient_id = N.recipient_id and M.filePath != '' and M.fileType != 'txt' and M.fileType != 'wav' limit 1";
    }
    //get just text to audio
    else if (mediaType == 2)
    {
        mediaSqlStatement = "SELECT M.filePath FROM PG1_Media M JOIN (" + recipientSqlStatement + ") N WHERE M.recipient_id = N.recipient_id and M.filePath != '' and M.fileType = 'wav' limit 1";
    }
    sqlite.exec(mediaSqlStatement, mediaResult);
    post(mediaResult.fieldname(0) + "\n");
    //media file is found, send path to max
	if(mediaResult.value(0,0) != 0)
	{
		//post(mediaResult.value(0,0));
		outlet(1, path + mediaResult.value(0,0));
    }
    //no media file found send bang to max to play a note
    else
        outlet(4, 'bang');
    
}

//get count of results of any sql statement passed in
function getCount(min, max, aggregation)
{
    if(demographicsSqlStatement == "false")
    {
        //get count of companies
        if(aggregation==0)
        {
            countsqlstatement = "select count(*) \
                            from (select distinct r.recipient_name \
                            from pg1_award a join pg1_recipient r \
                            where a.recipient_id = r.recipient_id and a.current_total_value_of_award between " + min + " and " + max + ")";
        }
        else if (aggregation==1)
        {
            countsqlstatement = "select count(*) \
                            from pg1_recipient r join (select a.recipient_id, sum(a.current_total_value_of_award)as summation \
                            from pg1_award a group by a.recipient_id) n \
                            where r.recipient_id = n.recipient_id and n.summation between " + min + " and " + max ;
        }
    }
    else
    {
        //get count of companies with demographics
        if(aggregation==0)
        {
            countsqlstatement = "select count(*) \
                            from (select distinct r.recipient_name \
                            from pg1_award a join pg1_recipient r join ("+ demographicsSqlStatement +") O\
                            WHERE A.recipient_id = R.recipient_id AND R.recipient_id = O.recipient_id \
                            and a.current_total_value_of_award between " + min + " and " + max + ")";
        }
        else if (aggregation==1)
        {
            countsqlstatement = "select count(*) \
                            from pg1_recipient r join (select a.recipient_id, sum(a.current_total_value_of_award)as summation \
                            from pg1_award a group by a.recipient_id) n join (" + demographicsSqlStatement + ") O\
                            where r.recipient_id = n.recipient_id and n.recipient_id = O.recipient_id \
                            and n.summation between " + min + " and " + max ;
        }
    }
    sqlite.exec(countsqlstatement, countResult);
    outlet(2, parseInt(countResult.value(0,0)));
}

//close the database
function closeDb(){
    sqlite.close();
}


