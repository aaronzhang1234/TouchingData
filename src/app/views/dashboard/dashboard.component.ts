import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { timeout } from 'rxjs/operators';
import * as socketio from 'socket.io-client';


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
	
	ngOnInit() {

	}

	buildDb() {
		const headers = new HttpHeaders().set("Content-Type", "application/json");

		this.http.post("/buildDb", { status: "Go" }, { headers: headers })
			.subscribe(data => {
				console.log(data);
				this.dbCreateStatus = (data as any).status;
			});
	}

	import() {
		console.log("you touched me");
		const headers = new HttpHeaders().set("Content-Type", "application/json");
		const io = socketio("http://localhost:3000");
		this.http
			.post("/import", { fileName: this.fileName }, { headers: headers })
			.pipe(timeout(600))
			.subscribe(data => {
				console.log(data);
				this.migrateStatus = (data as any).status;
			});
		let progress = <HTMLProgressElement>document.getElementById('progress');
		progress.value = 0;

		io.on("migrate", (data)=>{
			console.log((data as any).status)
			progress.value = (100*(data as any).progress);
			this.migrateStatus = (data as any).status
		});

		//let bar = document.getElementById("progressbar");
		//bar.setAttribute("style", "display:inline-block;");

	}
			
}
