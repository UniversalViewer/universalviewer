import Dialogue = require("./Dialogue");

class TestDialogue extends Dialogue {
    //static HIDE_GENERIC_DIALOGUE: string = 'onHideGenericDialogue';
    //static SHOW_GENERIC_DIALOGUE: string = 'onShowGenericDialogue';

    constructor($element: JQuery) {
        super($element);
    }

    create(): void {

    }
}

export = TestDialogue;