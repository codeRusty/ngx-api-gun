import { Injectable } from '@angular/core';
import { RequestBullet, RequestType, BufferType } from './request-bullet';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http'
import * as crypto from "crypto-browserify";
import { Buffer } from 'buffer/';
const LSKEY = 'en_mb';

@Injectable()
export class ApiGunService {

  //#region Properties
  //Buffers Declared
  private MainBuffer: RequestBullet[] = [];
  private OfflineBuffer: RequestBullet[] = [];
  private ErrorBuffer: RequestBullet[] = [];
  private SuccessBuffer: RequestBullet[] = [];

  //Other private members of the class

  private _headers: HttpHeaders = new HttpHeaders();


  private _secretKey: string = 'secret-key'; // default
  public algorithm = 'aes-256-ctr'; // default
  //#endregion Properties

  constructor(public _HttpClient: HttpClient) {

  }


  //#region Headers

  /**
   * Sets a secret for encrypting buffer when need to save on clients LocalStorage
   * @param secretKey 
   */
  public setEncryptSecret(secretKey: string) {
    this._secretKey = secretKey;
  }

  /**
   * Set username and password Authorization Header
   * @param username 
   * @param password 
   */
  public setBasicAuthorizationHeader(username: string, password: string) {
    this._headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
  }

  /**
   * Set any Key value pair to the Header
   * @param key 
   * @param value 
   */
  public appendHeader(key: string, value: string) {
    this._headers.append(key, value)
  }

  //#endregion Headers

  //#region Buffer action

  /**
   * Add a new request to *MainBuffer* to Shoot later and returns a ID*(GUID String)* to track the response and status anytime using the method *checkSingleBuffer*
   * @param request 
   */
  public loadSingleBullet(request: RequestBullet): string {
    this.MainBuffer.push(request);
    return request.id.toString();

  }

  /**
 * Adds multiple requests to *MainBuffer* to Shoot later 
 * @param requestBullets 
 */
  public fillBullets(requestBullets: RequestBullet[]) {
    this.MainBuffer.concat(requestBullets);
  }

  /**
 * Updated the *MainBuffer* with a new request on behalf of ID and returns the element.
 * It returns null if found none
 * @param id 
 * @param request 
 */
  public updateSingleBullet(id, request: RequestBullet): RequestBullet {
    for (let index = 0; index < this.MainBuffer.length; index++) {
      let element = this.MainBuffer[index]
      if (element.id == id) {
        element.data = request.data;
        element.url = request.url;
        element.method = request.method;
        element.isSuccess = false;
        element.response = null;
        element.retries = 0;
        return element;
      }
      else if (index == this.MainBuffer.length - 1) {
        return null;
      }
    }
  }


  /**
 * Shoots a single Request from the *MainBuffer* to the server by ID
 * @param id 
 */
  public shootSingleBullet(id: string): void {
    for (let index = 0; index < this.MainBuffer.length; index++) {
      let element = this.MainBuffer[index]
      if (element.id == id) {
        this.shootToServer(element);
      }
    }
  }


  /**
 * Check a single request element from the *MainBuffer* 
 * @param id 
 */
  public checkSingleBullet(id): RequestBullet {
    for (let index = 0; index < this.MainBuffer.length; index++) {
      let element = this.MainBuffer[index]
      if (element.id == id) {
        return element;
      }
      else if (index == this.MainBuffer.length - 1) {
        return null;
      }
    }
  }


  /**
 * Shoots everything from the MainBuffer to the server and saves the response accordingly
 * Checks if client is online, it shoots the request to the server else saves the request to *OfflineBuffer*
 */
  public fire() {
    this.MainBuffer.forEach(element => {
      // Check if Online
      if (navigator.onLine) {
        this.shootToServer(element);
      }
      else {
        this.handelOffline(element)
      }

    });
  }

  public recoil(request: RequestBullet) {
    this.MainBuffer.forEach(element => {
      // Check if Online
      if (navigator.onLine) {
        this.shootToServer(element);
      }
      else {
        this.handelOffline(element)
      }

    });
  }


  /**
* Reload 
* Copy *ErrorBuffer* and *OfflineBuffer* into the  *MainBuffer*
*/
  public reload() {
    this.MainBuffer.concat(this.ErrorBuffer);
    this.MainBuffer.concat(this.OfflineBuffer);
    this.ErrorBuffer = [];
    this.OfflineBuffer = [];
  }



  /**
 * Retries all present in the *ErrorBuffer*
 * Checks if client is online, it shoots the request to the server else saves the request to *OfflineBuffer*
 */
  public retryErrors() {
    this.ErrorBuffer.forEach(element => {
      // Check if Online
      if (navigator.onLine) {
        this.shootToServer(element);
      }
      else {
        this.handelOffline(element)
      }

    });
  }

  /**
   * Retries all Request *(OfflineBuffer)* which where made  when the client was not connected to any network
   */
  public retryOfflines() {
    this.OfflineBuffer.forEach(element => {
      // Check if Online
      if (navigator.onLine) {
        this.shootToServer(element);
      }
    });
  }


  /**
 * Shoot one request to a server which ever is passed
 * @param element 
 */
  private shootToServer(element: RequestBullet) {
    //check if already shot to server (success)
    if (!element.isSuccess) {
      if (element.method == RequestType.GET)
        this.GetRequest(element);
      if (element.method == RequestType.POST)
        this.PostRequest(element);
      if (element.method == RequestType.PUT)
        this.PutRequest(element);
      if (element.method == RequestType.DELETE)
        this.deleteRequest(element);
      if (element.method == RequestType.PATCH)
        this.patchRequest(element);
    }
  }

  /**
   * Just Logs all requests in client's browser console.
   * @param bufferType 
   */
  public logBufferToConsole(bufferType: BufferType) {

    switch (bufferType) {
      case BufferType.MAIN:
        this.MainBuffer.forEach(element => {
          console.log(element);
        });
        break;
      case BufferType.ERROR:
        this.ErrorBuffer.forEach(element => {
          console.log(element);
        });
        break;
      case BufferType.SUCCESS:
        this.SuccessBuffer.forEach(element => {
          console.log(element);
        });
        break;
      case BufferType.OFFLINE:
        this.OfflineBuffer.forEach(element => {
          console.log(element);
        });
        break;
      default:
        console.log('No Buffer');
        break;

    }

  }

  /**
   * Save all requests in client's browser LocalStorage.
   */
  public saveBulletsToLS() {
    let encrptyedRequest: any
    if (this.MainBuffer.length > 0) {
      let bufferStirng = JSON.stringify(this.MainBuffer)
      let encryptedMainBufferStirng = this.encrypt(bufferStirng);
      localStorage.setItem(LSKEY, encryptedMainBufferStirng);
    }
  }

  /**
   * Gets all requests in client's browser LocalStorage.
   */
  public loadBulletsFromLS() {
    let encryptedMainBufferStirng = localStorage.getItem(LSKEY);
    if (encryptedMainBufferStirng) {
      let dcryptedMainBufferStirng = this.decrypt(encryptedMainBufferStirng);
      this.MainBuffer.concat(JSON.parse(dcryptedMainBufferStirng));
    }
  }

  /**
   * Clears *MainBuffer* to a new state , but leaves the headers intact to let other request process easily.
   */
  public clearBuffersOnly() {
    this.MainBuffer = [];
    this.OfflineBuffer = [];
    this.ErrorBuffer = [];
  }

  /**
   * Clears only the SuccessBuffer
   */
  public clearSuccessBuffersOnly() {
    this.SuccessBuffer = [];
  }

  /**
   * Clears everything and takes this to a new state
   */
  public clearAll() {
    this.MainBuffer = [];
    this.SuccessBuffer = [];
    this.OfflineBuffer = [];
    this.ErrorBuffer = [];
    this._headers = new HttpHeaders();
  }

  //#endregion Buffer action

  //#region Request Wrappers + Request Handlers

  /**
   * Private GET Request
   * @param req 
   */
  private GetRequest(req: RequestBullet) {
    this._HttpClient.get(req.url, { headers: this._headers }).subscribe(
      (res) => { this.handelSuccess(req, res) },
      (err: HttpErrorResponse) => this.handelError(req, err),
      () => { req.isSuccess = true; }
    )
  }

  /**
   * Private POST Request
   * @param req 
   */
  private PostRequest(req: RequestBullet) {
    this._HttpClient.post(req.url, req.data, { headers: this._headers }).subscribe(
      (res) => { this.handelSuccess(req, res) },
      (err: HttpErrorResponse) => this.handelError(req, err),
      () => { req.isSuccess = true; }
    )
  }

  /**
   * Private PUT Request
   * @param req 
   */
  private PutRequest(req: RequestBullet) {
    this._HttpClient.put(req.url, req.data, { headers: this._headers }).subscribe(
      (res) => { this.handelSuccess(req, res) },
      (err: HttpErrorResponse) => this.handelError(req, err),
      () => { req.isSuccess = true; }
    )
  }

  /**
   * Private DELETE Request
   * @param req 
   */
  private deleteRequest(req: RequestBullet) {
    this._HttpClient.delete(req.url, { headers: this._headers }).subscribe(
      (res) => { this.handelSuccess(req, res) },
      (err: HttpErrorResponse) => this.handelError(req, err),
      () => { req.isSuccess = true; }
    )
  }

  /**
   * Private PATCH Request
   * @param req 
   */
  private patchRequest(req: RequestBullet) {
    this._HttpClient.patch(req.url, req.data, { headers: this._headers }).subscribe(
      (res) => { this.handelSuccess(req, res) },
      (err: HttpErrorResponse) => this.handelError(req, err),
      () => { req.isSuccess = true; }
    )
  }

  /**
   * The backend returned an error response.
   * @param req 
   * @param err 
   */
  private handelError(req: any, err: HttpErrorResponse) {
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      req.response = JSON.stringify(err)
    } else {
      // The response body may contain clues as to what went wrong,
      req.response = `Backend returned code ${JSON.stringify(err)}, body was: ${err.error}`;
    }

    // Let us remove the request from the main buffer 
    let index = this.MainBuffer.indexOf(req);
    if (index > -1) {
      this.MainBuffer.splice(index, 1);
    }

    req.response = JSON.stringify(err);
    this.addToErrorBuffer(req);
  }

  /**
   * Checks if the *ErrorBuffer* is Already has the request
   * @param req 
   */
  private addToErrorBuffer(req) {
    req.isSuccess = false;
    req.retries = req.retries + 1;
    for (let index = 0; index < this.ErrorBuffer.length; index++) {
      let element = this.ErrorBuffer[index]
      if (element.id == req.id) {
        break;
      }
      else if (index == this.ErrorBuffer.length - 1) {
        this.ErrorBuffer.push(req);
      }
    }
    if (this.ErrorBuffer.length == 0)
      this.ErrorBuffer.push(req);
  }

  /**
   * It Handles whenever there is a success response from the server
   * |1-> It checks if the request of this response was made from *MainBuffer* it moves the req from the *MainBuffer* to the *SuccessBuffer*
   * |2-> It checks if the request of this response was made from *ErrorBuffer* it moves the req from the *ErrorBuffer* to the *SuccessBuffer*
   * |3-> It checks if the request of this response was made from *OfflineBuffer* it moves the req from the *OfflineBuffer* to the *SuccessBuffer*
   * @param req 
   * @param res 
   */
  private handelSuccess(req: any, res: any) {
    // Let us remove the request from the main buffer 
    let index = -1
    if (this.MainBuffer.indexOf(req) > -1) {
      index = this.MainBuffer.indexOf(req);
      this.MainBuffer.splice(index, 1);
      req.response = JSON.stringify(res);
      this.addToSuccessBuffer(req);
    }
    else if (this.ErrorBuffer.indexOf(req) > -1) {
      index = this.ErrorBuffer.indexOf(req);
      this.ErrorBuffer.splice(index, 1);
      req.response = JSON.stringify(res);
      this.addToSuccessBuffer(req);
    }
    else if (this.OfflineBuffer.indexOf(req) > -1) {
      index = this.OfflineBuffer.indexOf(req);
      this.OfflineBuffer.splice(index, 1);
      req.response = JSON.stringify(res);
      this.addToSuccessBuffer(req);
    }
  }
  /**
   * handles Success response
   * @param req 
   */
  private addToSuccessBuffer(req) {
    for (let index = 0; index < this.SuccessBuffer.length; index++) {
      let element = this.SuccessBuffer[index]
      if (element.id == req.id) {
        break;
      }
      else if (index == this.SuccessBuffer.length - 1) {
        this.SuccessBuffer.push(req);
      }
    }
    if (this.SuccessBuffer.length == 0)
      this.SuccessBuffer.push(req);
  }

  /**
   * Handles Request if the Client is Offline
   * @param req 
   */
  private handelOffline(req: any) {
    // Let us remove the request from the main buffer 
    let index = this.MainBuffer.indexOf(req);
    if (index > -1) {
      this.MainBuffer.splice(index, 1);
      this.addToOfflineBuffer(req);
    }
  }
  /**
   * Checks if the request is not already in the *OfflineBuffer* it add to it. else do nothing.
   * @param req 
   */
  private addToOfflineBuffer(req) {
    for (let index = 0; index < this.OfflineBuffer.length; index++) {
      let element = this.OfflineBuffer[index]
      if (element.id == req.id) {
        break;
      }
      else if (index == this.OfflineBuffer.length - 1) {
        this.OfflineBuffer.push(req);
      }
    }
    if (this.OfflineBuffer.length == 0)
      this.OfflineBuffer.push(req);
  }

  //#endregion Request Wrappers + Request Handlers



  encrypt(text) {
    var cipher = crypto.createCipher(this.algorithm, this._secretKey)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
  }

  decrypt(text) {
    var decipher = crypto.createDecipher(this.algorithm, this._secretKey)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
  }




}
