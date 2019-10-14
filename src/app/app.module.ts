import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./views/dashboard/dashboard.component";
import { WebscraperComponent } from "./views/webscraper/webscraper.component";
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { NavigationComponent } from "./layout/navigation/navigation.component";
import { DatabaseComponent } from "./views/database/database.component";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    WebscraperComponent,
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    DatabaseComponent
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
