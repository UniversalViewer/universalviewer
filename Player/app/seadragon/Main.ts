/// <reference path="../../js/jquery.d.ts" />
import baseMain = module("app/shared/Main");
import left = module("app/seadragon/Left");
import center = module("app/seadragon/Center");
import right = module("app/seadragon/Right");

export class Main extends baseMain.Main {

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {
        super.create();

        new left.Left(baseMain.Main.$leftPanel);
        new center.Center(baseMain.Main.$centerPanel);
        new right.Right(baseMain.Main.$rightPanel);
    }

    resize(): void {
        super.resize();
    }
}