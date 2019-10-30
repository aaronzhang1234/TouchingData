import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { timeout } from 'rxjs/operators';

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  constructor(private http: HttpClient) {}

  fileName: string = "ChooseFile";
  dbCreateStatus: string = "";
	migrateStatus: string = "";

  ngOnInit() {}

  buildDb() {
    const headers = new HttpHeaders().set("Content-Type", "application/json");

    this.http
      .post("/buildDb", { status: "Go" }, { headers: headers })
      .subscribe(data => {
        console.log(data);
        this.dbCreateStatus = (data as any).status;
      });
  }

  import() {
		//let bar = document.getElementById("progressbar");
		//bar.setAttribute("style", "display:inline-block;");
		this.migrateStatus =  "data is being imported"

    const headers = new HttpHeaders().set("Content-Type", "application/json");

    console.log("you touched me");
    this.http
			.post("/import", { fileName: this.fileName }, { headers: headers })
			.pipe(timeout(600))
      .subscribe(data => {
        console.log(data);
				this.migrateStatus = (data as any).status;
      });
  }
}
