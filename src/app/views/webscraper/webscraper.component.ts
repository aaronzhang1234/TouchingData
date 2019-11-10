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
        console.log("yay"); 
      },
      err => {
        console.log("wee woo wee woo");
        console.log(JSON.stringify(err));
      }
    );
  }
  fetchWebsites(){
     this.http.get("/getWebsites").subscribe(
      data=>{
        console.log("yay"); 
      },
      err => {
        console.log("wee woo wee woo");
        console.log(JSON.stringify(err));
      }
    );   
  }
  downloadMedia(){
    this.http.get("/downloadMedia").subscribe(
      data=>{
        console.log("yay"); 
      },
      err => {
        console.log("wee woo wee woo");
        console.log(JSON.stringify(err));
      }
    );
  }
}
