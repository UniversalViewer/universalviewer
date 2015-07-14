class ServiceProfile {
    static autoComplete = new ServiceProfile("http://iiif.io/api/autocomplete/1/");
    static login = new ServiceProfile("http://iiif.io/api/image/2/auth/login");
    static logout = new ServiceProfile("http://iiif.io/api/image/2/auth/logout");
    static otherManifestations = new ServiceProfile("http://iiif.io/api/otherManifestations.json");
    static searchWithin = new ServiceProfile("http://iiif.io/api/search/1/");
    static token = new ServiceProfile("http://iiif.io/api/image/2/auth/token");

    constructor(public value: string) {
    }

    toString() {
        return this.value;
    }
}

export = ServiceProfile;