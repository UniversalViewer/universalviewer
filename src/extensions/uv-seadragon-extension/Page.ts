class Page {
    public tileSource: any;
    public tileSourceUri: string;
    public GetTileSource(): JQueryXHR {
        return $.ajax({
            dataType: "json",
            url: this.tileSourceUri,
            success: (data: any) => {
                this.tileSource = data;
            },
            error: (error: any, message: any) => {
                console.error(message);
            }
        });
    }
}

export = Page;