import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  constructor(private http: HttpClient) {}

  fileName: string = "ChooseFile";

  ngOnInit() {}

  buildDb() {
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    this.http
      .post("/buildDb", { status: "Go" }, { headers: headers })
      .subscribe(data => {
        console.log(data);
      });
  }

  import() {
    let bar = document.getElementById("progressbar");
    bar.setAttribute("style", "display:inline-block;");

    const headers = new HttpHeaders().set("Content-Type", "application/json");

    console.log("you touched me");
    this.http
      .post("/import", { fileName: this.fileName }, { headers: headers })
      .subscribe(data => {
        console.log(data);
      });
  }
}
