import InformationType = require("./InformationType");

class InformationArgs {
    constructor(public informationType: InformationType, public param: any) {

    }
}

export = InformationArgs;