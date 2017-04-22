
export class UVUtils {
    static sanitize(html: string): string {
        const elem: Element = document.createElement('div');
        const $elem: JQuery = $(elem);

        $elem.html(html);

        const s: any = new Sanitize({
            elements:   ['a', 'b', 'br', 'img', 'p', 'i', 'span'],
            attributes: {
                a: ['href'],
                img: ['src', 'alt']
            },
            protocols:  {
                a: { href: ['http', 'https'] }
            }
        });

        $elem.html(s.clean_node(elem));

        return $elem.html();
    }
}