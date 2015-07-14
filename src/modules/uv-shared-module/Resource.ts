import IAccessToken = require("./IAccessToken");
import IProvider = require("./IProvider");
import ServiceProfile = require("../../modules/uv-shared-module/ServiceProfile");
import Session = require("./Session");

class Resource {
    public authorizationRequired: boolean = false;
    public data: any;
    public dataUri: string;
    public error: any;
    public loginService: string;
    public logoutService: string;
    public provider: IProvider;
    public status: number;
    public tokenService: string;

    constructor(provider: IProvider) {
        this.provider = provider;
    }

    public getAccessToken(): IAccessToken {
        return <IAccessToken>Session.get(this.tokenService);
    }

    public getData(): Promise<Resource> {
        var that = this;
        var accessToken = that.getAccessToken();

        return new Promise<Resource>((resolve, reject) => {

            $.ajax(<JQueryAjaxSettings>{
                url: that.dataUri,
                type: 'GET',
                dataType: 'json',
                beforeSend: (xhr) => {
                    if (accessToken){
                        xhr.setRequestHeader("Authorization", "Bearer " + accessToken.accessToken);
                    }
                }
            }).done((data) => {
                that.status = 200;
                that.data = data;
                resolve(that);
            }).fail((error) => {
                that.status = error.status;
                that.error = error;
                if (that.status === 401 && error.responseJSON){
                    that.authorizationRequired = true;
                    that.loginService = that.provider.getService(error.responseJSON, ServiceProfile.login)['@id'];
                    that.logoutService = that.provider.getService(error.responseJSON, ServiceProfile.logout)['@id'];
                    that.tokenService = that.provider.getService(error.responseJSON, ServiceProfile.token)['@id'];
                }
                resolve(that);
            });
        });
    }
}

export = Resource;