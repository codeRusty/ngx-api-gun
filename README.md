# NgxApiGun

The AngularJS Http Client Wrapper Created to Ease things up.
 Buffer each and evry requests and track the response. 

You can use this advantage and shoot multiple requests to the server and 
1) later on check the response 
2) Get all the request where Error occoured
3) Check if any pending Offline request (request made while client was offline)
4) Retry Errors
5) Retry Offlines




You can also use this package to convert from text to image and then save it.


## Installation

To install this library, run:

```bash
$ npm install txt-img --save
```

## Consuming this library

You can import your library in any Angular application by running:

```bash
$ npm install txt-img
```

and then from your Angular `AppModule`:

`File :` app.module.ts

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { ApiGunModule, ApiGunService, Buffer, RequestBullet, RequestType } from 'ngx-api-gun'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    //our module
    ApiGunModule
  ],
  //our service Note: In later updated forRoot() added.
  providers: [ApiGunService],
  bootstrap: [AppComponent]
})
export class AppModule { }

```
and then from your Angular `AppModule`:

`File :` app.component.ts

```typescript
import { Component } from '@angular/core';

// New import
import { ApiGunModule, ApiGunService, Buffer, RequestBullet, RequestType } from 'ngx-api-gun'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Initilizing Bullets
  Req: RequestBullet = new RequestBullet();
  // Injection of Gun Service
  constructor(public _bridge: ApiGunService) {

  }

  addHeader() {
    this._bridge.appendHeader('key', 'value');
  }
  
  addAuthorization() {
    this._bridge.setBasicAuthorizationHeader('username','password');
  }


  addRequest() {
    // Object.assign
    let x = JSON.parse(JSON.stringify(this.Req));
    //load a single request to buffer it 
    let id = this._bridge.loadSingleBullet(x);
    //initialize again
    this.Req = new RequestBullet();
  }

  shootRequest() {
      // shoot all pending request
    this._bridge.fire();
  }

  logSuccess() {
    this._bridge.logBufferToConsole(Buffer.SUCCESS);
  }
  logError() {
    this._bridge.logBufferToConsole(Buffer.ERROR);
  }
  logAll() {
    this._bridge.logBufferToConsole(Buffer.MAIN);
  }
  // simply retry errors any time.
  retryError() {
    this._bridge.retryErrors();
  }
  retryOffline() {
    this._bridge.retryOfflines();
  }

}

```
## View

`File :` app.component.html

```xml 
<div>
<ul>
  <li>
    <input [(ngModel)]="Req.url" />
  </li>
  <li>
    <input [(ngModel)]="Req.data" />
  </li>
  <li>
    <button (click)="addRequest()">Add</button>
  </li>
  <li>
    <button (click)="shootRequest()">Shoot</button>
  </li>
  <li>
    <button (click)="logError()">Log Error</button>
  </li>
  <li>
    <button (click)="logAll()">Log Pending</button>
  </li>
  <li>
    <button (click)="logSuccess()">Log Success</button>
  </li>
  <li>
    <button (click)="retryError()">Retry Error</button>
  </li>
</ul>
</div>
```

Once your library is imported, you can use its components, directives and pipes in your Angular application:


## Component API

Get a complete detail [here](https://coderusty.github.io/ngx-api-gun/injectables/ApiGunService.html)


## Issues

Please report bugs and issues [here](https://github.com/codeRusty/ngx-api-gun/issues).


## Docs

Get a complete detail [here](https://coderusty.github.io/ngx-api-gun/injectables/ApiGunService.html)


## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run packagr
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

To `docs`

```bash
$ npm run docs:build
```

## Change log

### v1.3.0

- Working Library , with all abstraction


## License

MIT © [Sourabh Rustagi](mailto:sourabh.rustagi@hotmail.com)

