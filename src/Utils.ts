import { IUVData } from './IUVData';

declare var filterXSS: any;

export class UVUtils {
	static sanitize(html: string): string {
		return filterXSS(html, {
			whiteList: {
				b: [],
				a: [ 'href', 'title', 'target', 'class', 'data-uv-navigate' ],
				br: [],
				i: [],
				img: [ 'src' ],
				p: [],
				small: [],
				sub: [],
				sup: [],
				span: [ 'data-uv-navigate' ]
			}
		});
	}

	static isValidUrl(value: string): boolean {
		const a = document.createElement('a');
		a.href = value;
		return !!a.host && a.host !== window.location.host;
	}

	static propertiesChanged(newData: IUVData, currentData: IUVData, properties: string[]): boolean {
		let propChanged: boolean = false;

		for (var i = 0; i < properties.length; i++) {
			propChanged = UVUtils.propertyChanged(newData, currentData, properties[i]);
			if (propChanged) {
				break;
			}
		}

		return propChanged;
	}

	static propertyChanged(newData: IUVData, currentData: IUVData, propertyName: string): boolean {
		return newData[propertyName] !== undefined && currentData[propertyName] !== newData[propertyName];
	}
}
