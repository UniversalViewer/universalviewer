

class bootstrapParams {
    manifestUri: string;
    config: string;
    jsonp: boolean;
    isHomeDomain: boolean;
    isReload: boolean;
    locale: string;
    localeName: string;
    locales: any[];
    embedDomain: string;
    isOnlyInstance: boolean;
    embedScriptUri: string;
    domain: string;
    isLightbox: boolean;

    // parse string 'en-GB' or 'en-GB:English,cy-GB:Welsh' into array
    setLocale(locale: string): void {
        this.locale = locale;
        this.locales = [];
        var l = this.locale.split(',');

        for (var i = 0; i < l.length; i++) {
            var v = l[i].split(':');
            this.locales.push({
                name: v[0].trim(),
                label: (v[1]) ? v[1].trim() : ""
            });
        }

        this.localeName = this.locales[0].name;
    }

    getLocaleName(): string {
        return this.localeName;
    }
}

export = bootstrapParams;