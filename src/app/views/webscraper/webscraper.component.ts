import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as socketio from 'socket.io-client';

@Component({
  selector: 'app-webscraper',
  templateUrl: './webscraper.component.html',
  styleUrls: ['./webscraper.component.scss']
})
export class WebscraperComponent implements OnInit {

  constructor(private http:HttpClient) { }

  ngOnInit() {
  }

  startScrape(){
    let nowscraping = document.getElementById('now-scraping');

    const io = socketio("http://localhost:3000");
    io.on("webscraper", (data)=>{
       console.log(data);
    });

    let bar = document.getElementById("progressbar");
    bar.setAttribute("style", "display:inline-block;");
    console.log("bopped");
    this.http.get("/scrapeSites").subscribe(
      data=>{
        console.log("Currently Scraping"); 
      },
      err => {
        console.log("Error detected on scraping sites");
        console.log(JSON.stringify(err));
      }
    );
  }
  fetchWebsites(){
     this.http.get("/getWebsites").subscribe(
      data=>{
        console.log("Currently Getting Websites"); 
      },
      err => {
        console.log("Error detected on getting bing results");
        console.log(JSON.stringify(err));
      }
    );   
  }
  downloadMedia(){
    this.http.get("/downloadMedia").subscribe(
      data=>{
        console.log("Currently Downloading Media"); 
      },
      err => {
        console.log("Error detected on downloading media");
        console.log(JSON.stringify(err));
      }
    );
  }
}
