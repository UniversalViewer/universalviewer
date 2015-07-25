import IAccessToken = require("./IAccessToken");
import IProvider = require("./IProvider");
import Storage = require("./Storage");

class Resource {
    public data: any;
    public dataUri: string;
    public error: any;
    public isAccessControlled: boolean = false;
    public loginService: string;
    public logoutService: string;
    public provider: IProvider;
    public status: number;
    public tokenService: string;

    constructor(provider: IProvider) {
        this.provider = provider;
    }

    private _parseAuthServices(resource: any): void {

        // todo: use constants
        var loginService: Manifesto.IService = this.provider.getService(resource, "login");
        if (loginService) this.loginService = loginService.id;

        // todo: use constants
        var logoutService: Manifesto.IService = this.provider.getService(resource, "logout");
        if (logoutService) this.logoutService = logoutService.id;

        // todo: use constants
        var tokenService: Manifesto.IService = this.provider.getService(resource, "token");
        if (tokenService) this.tokenService = tokenService.id;

        if (this.loginService) this.isAccessControlled = true;
    }

    public getData(accessToken?: IAccessToken): Promise<Resource> {
        var that = this;

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
                that._parseAuthServices(that.data);
                resolve(that);
            }).fail((error) => {
                that.status = error.status;
                that.error = error;
                if (error.responseJSON){
                    that._parseAuthServices(error.responseJSON);
                }
                resolve(that);
            });
        });
    }
}

export = Resource;