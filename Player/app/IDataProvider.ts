export interface IDataProvider {
    data: any;
    options: any;
    getData(dataUri: string, callbackFunc: (data: any) => any);
    setData(data: any);
}