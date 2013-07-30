/// <reference path="../../../js/jquery.d.ts" />
import utils = module("app/Utils");

export class Thumb {

    index: number;
    url: string;
    label: string;
    height: number;
    visible: bool;

    constructor(index: number, url: string, label: string, height: number, visible: bool) {
        this.index = index;
        this.url = url;
        this.label = label;
        this.height = height;
        this.visible = visible;
    }
}