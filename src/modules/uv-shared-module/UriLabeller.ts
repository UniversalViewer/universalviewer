// This class formats URIs into HTML <a> links, applying labels when available
class UriLabeller {
    labels: Object;

    constructor(labels: Object) {
        this.labels = labels;
    }

    format(url): string {
        var label = this.labels[url] ? this.labels[url] : url;
        return '<a href="' + url + '">' + label + '</a>';
    }
};

export = UriLabeller;