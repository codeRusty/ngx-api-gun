# NgxApiGun

The AngularJS Http Client Wrapper Created to Ease things up.
 Buffer each and evry requests and track the response. 
You can use this advantage and shoot multiple requests to the server and 
1) later on check the response 
2) Get all the request where Error occoured
3) Get all the request where Error occoured
4) Check if any pending Offline request
5) Retry Errors
6) Retry Offlines




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


```typescript
import { AppComponent } from './app.component';

import { ApiGunModule, ApiGunService, Buffer, RequestBullet, RequestType } from 'ngx-api-gun'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ApiGunModule // <-- Module added to provider
  ],
  providers: [ApiGunService],// <-- Service added to provider
  bootstrap: [AppComponent]
})
export class AppModule { }
```
and then from your Angular `AppModule`:


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

  addRequest() {
    let x = JSON.parse(JSON.stringify(this.Req));
    this._bridge.loadSingleBullet(x);
    this.Req = new RequestBullet();
  }

  shootRequest() {
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
  retryError() {
    this._bridge.retryErrors();
  }

}

```
## View

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

To lint all `*.ts` files:

```bash
$ npm run docs:build
```

## Change log

### v1.3.0

- Working Library , with all abstraction


## License

MIT © [Sourabh Rustagi](mailto:sourabh.rustagi@hotmail.com)

