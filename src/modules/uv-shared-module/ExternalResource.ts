import Storage = require("./Storage");

class ExternalResource implements Manifesto.IExternalResource {
    public clickThroughService: Manifesto.IService;
    public data: any;
    public dataUri: string;
    public error: any;
    public isResponseHandled: boolean = false;
    public loginService: Manifesto.IService;
    public logoutService: Manifesto.IService;
    public status: number;
    public tokenService: Manifesto.IService;

    constructor(resource: Manifesto.IManifestResource, dataUriFunc: (r: Manifesto.IManifestResource) => string) {
        this.dataUri = dataUriFunc(resource);
        this._parseAuthServices(resource);
    }

    private _parseAuthServices(resource: any): void {
        this.clickThroughService = manifesto.getService(resource, manifesto.ServiceProfile.clickThrough().toString());
        this.loginService = manifesto.getService(resource, manifesto.ServiceProfile.login().toString());
        if (this.loginService){
            this.logoutService = this.loginService.getService(manifesto.ServiceProfile.logout().toString());
            this.tokenService = this.loginService.getService(manifesto.ServiceProfile.token().toString());
        }
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

            // check if dataUri ends with info.json
            // if not issue a HEAD request.

            var type: string = 'GET';

            // todo: use manifesto.hasServiceDescriptor
            if (!_.endsWith(that.dataUri, 'info.json')){
                // If access control is unnecessary, short circuit the process.
                // Note that isAccessControlled check for short-circuiting only
                // works in the "binary resource" context, since in that case,
                // we know about access control from the manifest. For image
                // resources, we need to check info.json for details and can't
                // short-circuit like this.
                if (!that.isAccessControlled()) {
                    that.status = HTTPStatusCode.OK;
                    resolve(that);
                    return;
                }
                type = 'HEAD';
            }

            $.ajax(<JQueryAjaxSettings>{
                url: that.dataUri,
                type: type,
                dataType: 'json',
                beforeSend: (xhr) => {
                    if (accessToken){
                        xhr.setRequestHeader("Authorization", "Bearer " + accessToken.accessToken);
                    }
                }
            }).done((data) => {

                // if it's a resource without an info.json
                // todo: if resource doesn't have a @profile
                if (!data){
                    that.status = HTTPStatusCode.OK;
                    resolve(that);
                } else {
                    var uri = unescape(data['@id']);

                    that.data = data;
                    that._parseAuthServices(that.data);

                    // remove trailing /info.json
                    if (_.endsWith(uri, '/info.json')){
                        uri = uri.substr(0, _.lastIndexOf(uri, '/'));
                    }

                    var dataUri = that.dataUri;

                    if (_.endsWith(dataUri, '/info.json')){
                        dataUri = dataUri.substr(0, _.lastIndexOf(dataUri, '/'));
                    }

                    // if the request was redirected to a degraded version and there's a login service to get the full quality version
                    if (uri !== dataUri && that.loginService){
                        that.status = HTTPStatusCode.MOVED_TEMPORARILY;
                    } else {
                        that.status = HTTPStatusCode.OK;
                    }

                    resolve(that);
                }

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