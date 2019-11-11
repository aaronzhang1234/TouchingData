import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as socketio from 'socket.io-client';

@Component({
  selector: 'app-webscraper',
  templateUrl: './webscraper.component.html',
  styleUrls: ['./webscraper.component.scss']
})
export class WebscraperComponent implements OnInit {
  progressOutput; outputBox; startButton; stopButton; scrapeProgressBar;

  constructor(private http:HttpClient) {
   }

  ngOnInit() {
    this.progressOutput = document.getElementById('progressOutput');
    this.outputBox = document.getElementById('output');
    this.startButton = document.getElementById('startScraping');
    this.stopButton = document.getElementById('stopScraping');
    this.scrapeProgressBar = document.getElementById('progressbar');
  }

  startScrape(){
    this.outputBox.setAttribute("style", "display:block");
    this.startButton.setAttribute("style", "display: none");
    this.stopButton.setAttribute("style", "display: flex");
    this.scrapeProgressBar.setAttribute("style", "display: inline-block");


    const io = socketio("http://localhost:3000");
    io.on("website", (data)=>{
       this.progressOutput.textContent = "Scraping site: " + data["arg1"];     
    });
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
  stopScrape() {
    this.stopButton.setAttribute("style", "display:none");
    this.startButton.setAttribute("style", "display: flex");
    this.outputBox.setAttribute("style", "display: none");
    this.scrapeProgressBar.setAttribute("style", "display: none");

  }
}
