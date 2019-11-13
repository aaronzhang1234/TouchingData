/* ****************** TEXTAUDIO.JS ******************
 * 2019 November 11 : Hadi Haidar : Created
 ********************************************
 * Purpose : File that runs saves files as text to audio *
 */

const say = require('say');
var fs = require('fs'),
    path = require('path');

var filepath = path.join(__dirname, 'test.txt');

fs.readFile("test.txt", "utf-8", function(err, data){
    if(err) throw err;
    say.export(data, 'Alex', 0.75, 'test.wav', (err) => {
        if (err) {
          return console.error(err)
        }
       
        console.log('Text has been saved to test.wav.')
      })
})


//say.speak("What's up Hadi?", 'Alex', .5);
