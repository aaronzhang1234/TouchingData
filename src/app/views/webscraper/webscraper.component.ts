import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import Pusher from 'pusher-js';

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
    Pusher.logToConsole = true;
    let nowscraping = document.getElementById('now-scraping');
    let pusher = new Pusher('f1731416f119bafdc832', {
      cluster: 'us2',
      forceTLS: true
    });

    let channel = pusher.subscribe('my-channel');
    channel.bind('my-event', function(data) {
      nowscraping.textContent = data["message"];
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
