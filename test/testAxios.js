const axios = require("axios");

axios.get("https://www.spacejam.com/archive/spacejam/movie/jam.htm").then((results)=>{
    console.log(results);
})