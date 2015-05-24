class ServiceProfile {
    static autoComplete = new ServiceProfile("http://iiif.io/api/autocomplete/1/");
    static otherManifestations = new ServiceProfile("http://iiif.io/api/otherManifestations.json");
    static searchWithin = new ServiceProfile("http://iiif.io/api/search/1/");

    constructor(public value: string) {
    }

    toString() {
        return this.value;
    }
}

export = ServiceProfile;