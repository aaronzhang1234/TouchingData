import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./views/dashboard/dashboard.component";
import { DatabaseComponent } from "./views/database/database.component";
import { WebscraperComponent } from "./views/webscraper/webscraper.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full"
  },
  {
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "database",
    component: DatabaseComponent
  },
  {
    path: "webscraper",
    component: WebscraperComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
