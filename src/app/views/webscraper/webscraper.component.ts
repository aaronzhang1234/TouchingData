import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as socketio from 'socket.io-client';

@Component({
  selector: 'app-webscraper',
  templateUrl: './webscraper.component.html',
  styleUrls: ['./webscraper.component.scss']
})
export class WebscraperComponent implements OnInit {
  progressOutput; outputBox; startButton; stopButton; progressBar; io; progressAmount;

  constructor(private http:HttpClient) {
   }

  ngOnInit() {
    this.progressOutput = document.getElementById('progressOutput');
    this.outputBox = document.getElementById('output');
    this.startButton = document.getElementById('startScraping');
    this.stopButton = document.getElementById('stopScraping');
    this.progressBar = document.getElementById('progressbar');
    this.progressAmount = document.getElementById('progress');
    this.io = socketio("http://localhost:3000");
  }

  startScrape(){
    this.outputBox.setAttribute("style", "display:block");
    this.startButton.setAttribute("style", "display: none");
    this.stopButton.setAttribute("style", "display: flex");
    this.progressBar.setAttribute("style", "display: inline-block");


    this.io.on("website", (data)=>{
       this.progressOutput.textContent = "Scraping site: " + data["arg1"].websiteName;
       this.progressAmount.style.width = data["arg1"].webscrapeProgress + "%";     

    });
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
    this.outputBox.setAttribute("style", "display:block");
    this.progressBar.style.display = "inline-block";
    this.io.on("websiteUrl", (data)=>{
       this.progressOutput.textContent = "Website found. Company Name: " + data["arg1"].companyName + " URL: " + data["arg1"].urlResult; 
       this.progressAmount.style.width =  data["arg1"].urlProgress + "%";   
    });
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
    this.outputBox.setAttribute("style", "display:block");
    this.progressBar.setAttribute("style", "display: inline-block");
    this.io.on("downloadMediaStatus", (data)=>{
      this.progressOutput.textContent = data["arg1"].mediaFileName;
      this.progressAmount.style.width = data["arg1"].mediaDownloadProgress + "%";
    })
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
  convertTextToAudio() {
    this.outputBox.setAttribute("style", "display:block");
    this.progressBar.setAttribute("style", "display: inline-block");
    this.io.on("textToAudioStatus", (data)=> {
      this.progressOutput.textContent = data["arg1"].textFileName;
      this.progressAmount.style.width = data["arg1"].textConversionProgress + "%";
    })
    this.http.get("/convertTextToAudio").subscribe(
      data=>{
        console.log("Currently Converting Text to Audio");
      },
      err => {
        console.log("Error detected on converting text");
        console.log(JSON.stringify(err));
      }
    )
  }
  stopScrape() {
    this.stopButton.setAttribute("style", "display:none");
    this.startButton.setAttribute("style", "display: flex");
    this.outputBox.setAttribute("style", "display: none");
    this.progressBar.setAttribute("style", "display: none");

  }
}
