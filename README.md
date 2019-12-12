# TouchingData
These are the instructions for downloading and running the Touching Data Application.
https://youtu.be/_-5NYLhkWYw

## Software requirements:
Install node/npm, run “brew install node”
Install all required packages by running “npm i” in the command line at the root directory of the program (where you downloaded this application).

## Dashboard:
In the root directory of the downloaded repository run the following command ```./touchData.sh```
If you want a new database, click create new database.
Otherwise continue to the next step.
Once a database is established, you have the option to migrate data from an excel spreadsheet.
If you decide to migrate data you must click on the import button, and choose a file to import.
After the file is selected to be imported you must click upload and then migrate.
Once the data set is established, continue to the next step.
Under the Webscraper tab in the dashboard there are 4 buttons
The first button is to fetch the company websites.
If you already have the websites fetched continue to the next step
The second button is to start scraping websites for media, audio and text.
If you already have the media scraped continue to the next step.
The third button is to download all media
If you already have the media downloaded continue to the next step.
The fourth button is to convert text to audio
Once this is done you are ready to use the art installation.

## Detailed descriptions

### Database Creation:
Clicking the create database button will initialize the entire sql database as a ```.db``` file at ```data/POLITICS_OF_THE_GRID.db```. If there is already a file named ```data/POLITICS_OF_THE_GRID.db```, it will first backup that database file in data/sheets, and it will be replaced. To use the backed up database as the primary database once again, the user must access file path TouchingData/Data/backups/ then copy the appropriate version of the database. Then use the copied file to replace POLITICS_OF_THE_GRID.db and rename it as such. This will replace the newest database with whichever version was copied. This process should only take a moment, the new database will have no usable data, but can be connected to by the dashboard tools (such as the data migrator and the web scraper).



### Data Migration:
If there is no db available, you will not be to import data and this method will report an error, run  create database method first if you are running this application for the first time.
The data migration tool will import data from an Excel spreadsheet into the database. A default file (provided by our client) is included at ```data/ProjectDataBig.xlslx```. If the import button is clicked without first uploading an Excel spreadsheet it will import this default file (you must run import the first time you load the application if it was not packaged with a pre populated database). If you desire you can upload additional data, or create new databases with different datasets, by uploading  new excel spreadsheets. Follow these steps on the “Import Data” tab of the dashboard:
Browse and select an excel spreadsheet (it must be in the same format as the document at ```data/ProjectDataBig.xlsx```)
Click the upload button on the row of the selected file (you can upload multiple files and import them all at once)
Click the import button to import the uploaded files to the data base(if you do not import before ending this browser session / refreshing the page, you will not be able to without uploading those files again)
The file provided contains 5,853 award records and completes processing in less than a minute on most modern machines.

### Web Scraper Detail:
The web scraper section has all the functions and tools related to the gathering of company information and the downloading of said information.

The “Fetch Company URLs” button is the one that starts the Fetch Websites process on the node server, this process interacts with the Bing API so it is required that the user be connected to the internet while this happens (It is required that the user also have the required information in their database as explained in the data migration section)
Press the Fetch Websites Button and an alert will show warning the user that the process will take 30 minutes,
Confirm the popup. And the process begins and the button changes text from “Get Company URLs” to “Stop Fetching Company URLs”.
While the process is  running an output box will appear on the bottom of the screen showing the current progress of the processes and the loading bar will update accordingly.
To stop this process click on the button now labelled “Stop Fetching Company URLs” this will stop the process and the button will revert to the default display.

The “Start Scraping for Media” button is the one that starts the web scrape process on the node server, this process interacts with the Axios API so it is required that the user be connected to the internet while this happens (It is required that the user also have the required information in their database, and enough websites from the fetch websites function previously mentioned)
Press the Start Scraping for Media Button and an alert will show warning the user that the process will take 5+ hours,
Confirm the popup. And the process begins and the button changes text from “Start Scraping for Media” to “Stop Scraping”.
While the process is  running an output box will appear on the bottom of the screen showing the current progress of the processes and the loading bar will update accordingly.
To stop this process click on the button now labelled “Stop Scraping” this will stop the process and the button will revert to the default display.

The “Download Media” button is the one that starts the Download Media process on the node server, this process interacts with the Axios API so it is required that the user be connected to the internet while this happens (It is required that the user also have media files to download as gathered from the web scraper process)
Press the Download Media Button and an alert will show warning the user that the process will take 1 hour,
Confirm the popup. And the process begins and the button changes text from “Download Media” to “Stop Downloading Media”.
While the process is  running an output box will appear on the bottom of the screen showing the current progress of the processes and the loading bar will update accordingly.
To stop this process click on the button now labelled “Stop Downloading Media” this will stop the process and the button will revert to the default display.

The “Convert Text Files to Audio Files” button is the one that starts the Convert Text Files to Audio Files process on the node server, this process interacts with the Say API (It is required that the user also have media files to download as gathered from the web scraper process)
Press the Convert Text Files to Audio Files Button and an alert will show warning the user that the process will take 3+hours.
Confirm the popup. And the process begins and the button changes text from “Convert Text Files to Audio Files” to “Stop Converting Text Files to Audio Files”.
While the process is  running an output box will appear on the bottom of the screen showing the current progress of the processes and the loading bar will update accordingly.
To stop this process click on the button now labelled “Stop Converting Text Files to Audio Files” this will stop the process and the button will revert to the default display.




## Max Instructions:
Download Max
Open artinstallation.maxpat

### For art installation operation:
Press open database
Select a step range with the step range selector drop down
Select an award amount from the award amount selector
Select any filters desired from the filter drop down menus
Select All, Only Media, or Only Text to Speech in the media type drop down
 Ensure "Normal" is selected in function drop down
Press start/stop metronome toggle to begin installation
Press start/stop metronome toggle to stop playback
When desired, press the reset button to reset the installation
For list operation:
Complete steps 1-5 of the art installation instructions
Select "list" from the function dropdown
Press manual fire
When desired, press the reset button to reset the installation


## Art Installation Detailed Descriptions:

### Normal Operation 

The normal mode operation of the art installation connects to the Politics of the Grid database and dynamically creates an SQL query of said database based on user selections.. The user selects a step range which changes the range with which the award selector can be selected. The award amount selector is a slider bar that the user can select an award amount to query in the database. The user can then choose to select from several filters. Individual/Summation will change aggregation of awards to either individual awards or a summation of awards. The demographic awards can be selected to find companies with owners who are from a specific demographic background. Once all filters are chosen, the user can hit start metronome button to start playback of any media found from the companies queried in the database. The media played back every 6 seconds.

### List Operation 

The list operation runs exactly the same as the art installation but instead of playing the media found by the query, it will list the media file paths in a message box that can be queried for future art installation additions.


