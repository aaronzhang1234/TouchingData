const axios = require("axios");
const cheerio = require("cheerio");
const Excel = require('exceljs');
const fs = require('fs');

let search_url = "https://www.google.com/search?q=";
let workbook = new Excel.Workbook();
workbook.xlsx.readFile("ProjectDataBig.xlsx").then(function(){
    let worksheet = workbook.getWorksheet(2);
    worksheet.eachRow(function(row, rownumber){
        /*
        let company = row.getCell(7).value;
        axios.get(search_url+company)
        .then(response=>{
            //console.log(response.data)
            const $ = cheerio.load(response.data);
            if($(".BNeawe.UPmit.AP7Wnd").length == 0){
                console.log("Could not find anything");
            }else{
                $(".BNeawe.UPmit.AP7Wnd").each((i, elem)=>{
                    console.log(here);
                    if(i ==0) console.log($(elem).text());
                })
            }
        })
        .catch(error=>{
            console.log(error);
        })
        */
    });
});

let company = "LRP PUBLICATIONS INC.";
axios.get(search_url+company).then(response=>{
    let hmm = ""
    //console.log(response.data)
    const $ = cheerio.load(response.data);
    console.log($(".BNeawe.UPmit.AP7Wnd").length);
    $(".BNeawe.UPmit.AP7Wnd").each((i, elem)=>{
        if(i ==0) console.log($(elem).text());
    })
})
.catch(error=>{
    console.log(error);
})
