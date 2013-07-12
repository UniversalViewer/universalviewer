export interface IProvider {
    options: any;
    content: any;
    extensions: any;
    //getData(dataUri: string, callbackFunc: (data: any) => any);
    create(data: any);
}