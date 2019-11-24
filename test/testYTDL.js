const youtubedl = require("ytdl-core");
const fs = require("fs");

youtube_link = "https://www.youtube.com/watch?v=HluANRwPyNo";

youtubedl(youtube_link)
    .pipe(fs.createWriteStream("./yt_test.mp4"))
    .on('finish',()=> {
        console.log("Youtube Video has been downloaded");
    })
    .on('error',(error)=>{
        console.log(error);
    })    
