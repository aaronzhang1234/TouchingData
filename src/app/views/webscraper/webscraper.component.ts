import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-webscraper',
  templateUrl: './webscraper.component.html',
  styleUrls: ['./webscraper.component.scss']
})
export class WebscraperComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  startScrape(){
    let bar = document.getElementById("progressbar");
    bar.setAttribute("style", "display:inline-block;");
  }

}
