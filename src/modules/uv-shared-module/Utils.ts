export class UVUtils {
    static sanitize(html: string): string {
        return filterXSS(html, {
            whiteList: {
                a: ["href", "title", "target", "class"],
                br: [],
                img: ["src"],
                span: []
            }
        });
    }

    static isValidUrl(value: string): boolean {
        const a = document.createElement('a');
        a.href = value;
        return (!!a.host && a.host !== window.location.host);
    }
}