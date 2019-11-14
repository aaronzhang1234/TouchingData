import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as socketio from "socket.io-client";

@Component({
  selector: "app-webscraper",
  templateUrl: "./webscraper.component.html",
  styleUrls: ["./webscraper.component.scss"]
})
export class WebscraperComponent implements OnInit {
  progressOutput;
  outputBox;
  startButton;
  stopButton;
  progressBar;
  io;
  progressAmount;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.progressOutput = document.getElementById("progressOutput");
    this.outputBox = document.getElementById("output");
    this.startButton = document.getElementById("startScraping");
    this.stopButton = document.getElementById("stopScraping");
    this.progressBar = document.getElementById("progressbar");
    this.progressAmount = document.getElementById("progress");
    this.io = socketio("http://localhost:3000");
  }

  startScrape() {
    this.outputBox.setAttribute("style", "display:block");
    this.startButton.setAttribute("style", "display: none");
    this.stopButton.setAttribute("style", "display: flex");
    this.progressBar.setAttribute("style", "display: inline-block");
    confirm(
      "This will begin the Webscraper.. This is a 5 hour process. Are you sure you want to begin scraping?"
    );

    this.io.on("website", data => {
      this.progressOutput.textContent =
        "Scraping site: " + data["arg1"].websiteName;
      this.progressAmount.style.width = data["arg1"].webscrapeProgress + "%";
    });
    console.log("bopped");
    this.http.get("/scrapeSites").subscribe(
      data => {
        console.log("Currently Scraping");
      },
      err => {
        console.log("Error detected on scraping sites");
        console.log(JSON.stringify(err));
      }
    );
  }
  fetchWebsites() {
    this.outputBox.setAttribute("style", "display:block");
    this.progressBar.style.display = "inline-block";
    confirm(
      "This will begin to fetch websites.. This is a 15 minute process. Are you sure you want to begin Fetching?"
    );
    this.io.on("websiteUrl", data => {
      this.progressOutput.textContent =
        "Website found. Company Name: " +
        data["arg1"].companyName +
        " URL: " +
        data["arg1"].urlResult;
      this.progressAmount.style.width = data["arg1"].urlProgress + "%";
    });
    this.http.get("/getWebsites").subscribe(
      data => {
        console.log("Currently Getting Websites");
      },
      err => {
        console.log("Error detected on getting bing results");
        console.log(JSON.stringify(err));
      }
    );
  }
  downloadMedia() {
    this.outputBox.setAttribute("style", "display:block");
    this.progressBar.setAttribute("style", "display: inline-block");
    confirm(
      "This will begin to download media.. This is a 10 minute process. Are you sure you want to begin downloading media?"
    );
    this.io.on("downloadMediaStatus", data => {
      this.progressOutput.textContent = data["arg1"].mediaFileName;
      this.progressAmount.style.width =
        data["arg1"].mediaDownloadProgress + "%";
    });
    this.http.get("/downloadMedia").subscribe(
      data => {
        console.log("Currently Downloading Media");
      },
      err => {
        console.log("Error detected on downloading media");
        console.log(JSON.stringify(err));
      }
    );
  }
  stopScrape() {
    this.stopButton.setAttribute("style", "display:none");
    this.startButton.setAttribute("style", "display: flex");
    this.outputBox.setAttribute("style", "display: none");
    this.progressBar.setAttribute("style", "display: none");
    confirm(
      "This will begin to stop the Webscraper.. This will terminate the process. Are you sure you want to stop scraping?"
    );
  }
  textAudio() {
    this.outputBox.setAttribute("style", "display:block");
    this.progressBar.setAttribute("style", "display: inline-block");
    confirm(
      "This will begin to convert text files to audio.. This is a 10 minute process. Are you sure you want to begin text to audio?"
    );
    this.io.on("textAudioStatus", data => {
      this.progressOutput.textContent = data["arg1"].mediaFileName;
      this.progressAmount.style.width =
        data["arg1"].mediaDownloadProgress + "%";
    });
    this.http.get("/textAudio").subscribe(
      data => {
        console.log("Currently converting text files to audio");
      },
      err => {
        console.log("Error detected on text to audio");
        console.log(JSON.stringify(err));
      }
    );
  }
}
