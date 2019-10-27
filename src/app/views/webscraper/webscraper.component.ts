import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

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
    let bar = document.getElementById("progressbar");
    bar.setAttribute("style", "display:inline-block;");
    console.log("bopped");
    this.http.get("/whelp").subscribe(
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
