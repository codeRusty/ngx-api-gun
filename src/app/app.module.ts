import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ApiGunModule } from './modules/api-gun/api-gun.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ApiGunModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
