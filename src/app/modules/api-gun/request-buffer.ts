export interface IRequestBullet {
    id?: string;
    url: string;
    method: RequestType;
    data: any;
    response?: any;
    isSuccess?: boolean;
    retries: number;
}
export class RequestBullet implements IRequestBullet {
    id?: string;
    url: string;
    method: RequestType;
    data: any;
    response?: any;
    isSuccess: boolean;
    retries: number;
    constructor() {
        this.isSuccess = false;
        this.retries = 0;
        this.id = this.guid();
        this.url = "";
        this.data = "";
        this.method = RequestType.GET;
    }
    //#region GUID
    /// GUID Generator
    private guid() {
        return this.chunk() + this.chunk() + '-'
            + this.chunk() + '-'
            + this.chunk() + '-'
            + this.chunk() + '-'
            + this.chunk() + this.chunk() + this.chunk();
    }

    // GUID chunk provider
    private chunk() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    //#endregion

}

export enum Buffer {
    MAIN, ERROR, OFFLINE, SUCCESS
}

export enum RequestType {
    GET, PUT, POST, DELETE, PATCH
}