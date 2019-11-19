import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { timeout } from "rxjs/operators";
import * as socketio from "socket.io-client";
import { FileUploader } from "ng2-file-upload";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
  tile = "angular-file-upload";
  constructor(private http: HttpClient) {}

  fileName: string = "ChooseFile";
  dbCreateStatus: string = "";
  migrateStatus: string = "";
  migrating: boolean = false;
  public uploader: FileUploader = new FileUploader({
    url: "http://localhost:3000/upload"
  });

  ngOnInit() {}

  buildDb() {
    var x = confirm(
      "This will delete your old database and create a new one.. Are you sure you want to create a new database?"
    );
    if (x == true) {
      const headers = new HttpHeaders().set("Content-Type", "application/json");

      this.http
        .post("/buildDb", { status: "Go" }, { headers: headers })
        .subscribe(data => {
          console.log(data);
          this.dbCreateStatus = (data as any).status;
        });
    } else {
    }
  }

  import() {
    console.log("you touched me");

    let loadingImage = <HTMLImageElement>document.getElementById("loading");
    loadingImage.src = "assets/loading.gif";

    const io = socketio("http://localhost:3000");

    io.on("migrate", data => {
      console.log((data as any).status);
      this.migrateStatus = (data as any).status;
      loadingImage.src = "";
      this.migrating = false;
    });

    const headers = new HttpHeaders().set("Content-Type", "application/json");
    this.http
      .post("/import", { filePath: this.fileName }, { headers: headers })
      .pipe(timeout(600))
      .subscribe(data => {
        console.log(data);
        this.migrateStatus = (data as any).status;
        this.migrating = this.migrateStatus === "Migrating";
      });
  }
}
