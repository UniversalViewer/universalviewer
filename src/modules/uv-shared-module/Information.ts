import InformationAction = require("./InformationAction");

class Information {
    constructor(public message: string, public actions: InformationAction[]) {

    }
}

export = Information;