import { Component } from '@angular/core';
import { ApiGunModule, ApiGunService, BufferType, RequestBullet, RequestType } from '../../../ngx-api-gun/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ApiGunService]
})
export class AppComponent {
  title = 'app';

  Req: RequestBullet;
  constructor(public _gun: ApiGunService) {
    this.Req = new RequestBullet();
  }
  addHeader() {
    this._gun.appendHeader('key', 'value');
  }

  addAuthorization() {
    this._gun.setBasicAuthorizationHeader('username', 'password');
  }


  addRequest() {
    // Object.assign
    let x = JSON.parse(JSON.stringify(this.Req));
    //load a single request to buffer it 
    let id = this._gun.loadSingleBullet(x);
    //initialize again
    this.Req = new RequestBullet();
  }

  shootRequest() {
    // shoot all pending request
    this._gun.fire();
  }

  logSuccess() {
    this._gun.logBufferToConsole(BufferType.SUCCESS);
  }
  logError() {
    this._gun.logBufferToConsole(BufferType.ERROR);
  }
  logAll() {
    this._gun.logBufferToConsole(BufferType.MAIN);
  }
  // simply retry errors any time.
  retryError() {
    this._gun.retryErrors();
  }
  retryOffline() {
    this._gun.retryOfflines();
  }

  setBufferToLocal() {
    this._gun.saveBulletsToLS();
  }

  setBufferFromLocal() {
    this._gun.loadBulletsFromLS();
  }
}
