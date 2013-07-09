export interface IDataProvider {
    data: any;
    getData(dataUri: string, callbackFunc: (data: any) => any);
}