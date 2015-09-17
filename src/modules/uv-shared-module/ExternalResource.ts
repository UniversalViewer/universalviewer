import IProvider = require("./IProvider");
import Storage = require("./Storage");

class ExternalResource implements Manifesto.IExternalResource {
    public clickThroughService: Manifesto.IService;
    public data: any;
    public dataUri: string;
    public error: any;
    public isResponseHandled: boolean = false;
    public loginService: Manifesto.IService;
    public logoutService: Manifesto.IService;
    public provider: IProvider;
    public status: number;
    public tokenService: Manifesto.IService;

    // todo: pass in services associated with this resource if they exist
    // if the resource returns services in the info.json, those override
    constructor(provider: IProvider) {
        this.provider = provider;
    }

    private _parseAuthServices(resource: any): void {
        this.clickThroughService = manifesto.getService(resource, manifesto.ServiceProfile.clickThrough().toString());
        this.loginService = manifesto.getService(resource, manifesto.ServiceProfile.login().toString());
        this.logoutService = manifesto.getService(resource, manifesto.ServiceProfile.logout().toString());
        this.tokenService = manifesto.getService(resource, manifesto.ServiceProfile.token().toString());
    }

    public isAccessControlled(): boolean {
        if(this.clickThroughService || this.loginService){
            return true;
        }
        return false;
    }

    public getData(accessToken?: Manifesto.IAccessToken): Promise<Manifesto.IExternalResource> {
        var that = this;

        return new Promise<Manifesto.IExternalResource>((resolve, reject) => {

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

                var uri = unescape(data['@id']);

                if (!_.endsWith(uri, '/info.json')){
                    uri += '/info.json';
                }

                if (uri !== that.dataUri){
                    that.status = HTTPStatusCode.MOVED_TEMPORARILY;
                } else {
                    that.status = HTTPStatusCode.OK;
                }

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

export = ExternalResource;