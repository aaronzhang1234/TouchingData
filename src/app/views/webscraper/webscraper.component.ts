import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as socketio from "socket.io-client";

@Component({
  selector: "app-webscraper",
  templateUrl: "./webscraper.component.html",
  styleUrls: ["./webscraper.component.scss"]
})
export class WebscraperComponent implements OnInit {
  progressOutput;
  outputBox;
  startScrapeButton;
  stopScrapeButton;
  progressBar;
  io;
  progressAmount;
  stopFetchButton;
  startFetchButton;
  startDownloadButton;
  stopDownloadButton;
  startConvertButton;
  stopConvertButton;
  headers;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.progressOutput = document.getElementById("progressOutput");
    this.outputBox = document.getElementById("output");
    this.startScrapeButton = document.getElementById("startScraping");
    this.stopScrapeButton = document.getElementById("stopScraping");
    this.startFetchButton = document.getElementById("startFetching");
    this.stopFetchButton = document.getElementById("stopFetching");
    this.startDownloadButton = document.getElementById("startDownloading");
    this.stopDownloadButton = document.getElementById("stopDownloading");
    this.startConvertButton = document.getElementById("startConverting");
    this.stopConvertButton = document.getElementById("stopConverting");
    this.progressBar = document.getElementById("progressbar");
    this.progressAmount = document.getElementById("progress");
    this.io = socketio("http://localhost:3000");
    this.headers = new HttpHeaders().set("Content-Type", "application/json");
  }

  startScrape() {
    var x = confirm(
      "This will begin the Webscraper.. This could take up to 5+ hours. Are you sure you want to begin scraping?"
    );
    if (x == true) {
      this.progressOutput.textContent = "";
      this.outputBox.setAttribute("style", "display:block");
      this.startScrapeButton.setAttribute("style", "display: none");
      this.stopScrapeButton.setAttribute("style", "display: flex");
      this.progressBar.setAttribute("style", "display: inline-block");

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
    } else {
    }
  }
  fetchWebsites() {
    var x = confirm(
      "This will begin to fetch websites.. This is a 30 minute process. Are you sure you want to begin Fetching?"
    );
    if (x == true) {
      this.progressOutput.textContent = "";
      this.outputBox.setAttribute("style", "display:block");
      this.progressBar.style.display = "inline-block";
      this.startFetchButton.setAttribute("style", "display: none");
      this.stopFetchButton.setAttribute("style", "display: flex");
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
    } else {
    }
  }
  downloadMedia() {
    var x = confirm(
      "This will begin to download media.. This is a 1 hour process. Are you sure you want to begin downloading media?"
    );
    if (x == true) {
      this.progressOutput.textContent = "";
      this.outputBox.setAttribute("style", "display:block");
      this.progressBar.setAttribute("style", "display: inline-block");
      this.startDownloadButton.setAttribute("style", "display: none");
      this.stopDownloadButton.setAttribute("style", "display: flex");
      this.io.on("downloadMediaStatus", data => {
        this.progressOutput.textContent =
          "Downloading: " + data["arg1"].mediaFileName;
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
    } else {
    }
  }

  convertTextToAudio() {
    var x = confirm(
      "This will begin to convert text files to audio.. This could take up to 3+ hours. Are you sure you want to begin text to audio?"
    );
    if (x == true) {
      this.progressOutput.textContent = "";
      this.outputBox.setAttribute("style", "display:block");
      this.progressBar.setAttribute("style", "display: inline-block");
      this.startConvertButton.setAttribute("style", "display: none");
      this.stopConvertButton.setAttribute("style", "display: flex");
      this.io.on("textToAudioStatus", data => {
        this.progressOutput.textContent =
          "Converting: " + data["arg1"].textFileName;
        this.progressAmount.style.width =
          data["arg1"].textConversionProgress + "%";
      });
      this.http.get("/convertTextToAudio").subscribe(
        data => {
          console.log("Currently Converting Text to Audio");
        },
        err => {
          console.log("Error detected on converting text");
          console.log(JSON.stringify(err));
        }
      );
    } else {
    }
  }

  stopScrape() {
    var x = confirm(
      "Performing this action will require restarting the process.. Are you sure you want to stop scraping? "
    );
    this.stopScrapeButton.setAttribute("style", "display:none");
    this.startScrapeButton.setAttribute("style", "display: flex");
    this.outputBox.setAttribute("style", "display: none");
    this.progressOutput.textContent = "";
    this.progressBar.setAttribute("style", "display: none");
    this.http
      .post("/cancelJob", { process: "scrape" }, { headers: this.headers })
      .subscribe();
  }
  stopFetching() {
    var x = confirm(
      "Performing this action will require restarting the process.. Are you sure you want to stop fetching websties?"
    );
    this.stopFetchButton.setAttribute("style", "display:none");
    this.startFetchButton.setAttribute("style", "display: flex");
    this.outputBox.setAttribute("style", "display: none");
    this.progressOutput.textContent = "";
    this.progressBar.setAttribute("style", "display: none");
    this.http
      .post("/cancelJob", { process: "fetch" }, { headers: this.headers })
      .subscribe();
  }
  stopDownloading() {
    var x = confirm(
      "Performing this action will require restarting the process.. Are you sure you want to stop downloading?"
    );
    this.stopDownloadButton.setAttribute("style", "display:none");
    this.startDownloadButton.setAttribute("style", "display: flex");
    this.outputBox.setAttribute("style", "display: none");
    this.progressOutput.textContent = "";
    this.progressBar.setAttribute("style", "display: none");
    this.http
      .post("/cancelJob", { process: "dl" }, { headers: this.headers })
      .subscribe();
  }
  stopConverting() {
    var x = confirm(
      "Performing this action will require restarting the process.. Are you sure you want to stop converting?"
    );
    this.stopConvertButton.setAttribute("style", "display:none");
    this.startConvertButton.setAttribute("style", "display: flex");
    this.outputBox.setAttribute("style", "display: none");
    this.progressOutput.textContent = "";
    this.progressBar.setAttribute("style", "display: none");
    this.http
      .post("/cancelJob", { process: "convert" }, { headers: this.headers })
      .subscribe();
  }
}
