import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FileSelectDirective, FileUploadModule } from 'ng2-file-upload';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DashboardComponent } from "./views/dashboard/dashboard.component";
import { WebscraperComponent } from "./views/webscraper/webscraper.component";
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { NavigationComponent } from "./layout/navigation/navigation.component";
import { FormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    WebscraperComponent,
    HeaderComponent,
    FooterComponent,
	NavigationComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, FileUploadModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
