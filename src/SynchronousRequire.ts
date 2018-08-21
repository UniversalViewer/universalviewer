export class SynchronousRequire {

    static load(deps: string[], cb: (index: number, dep: any, deps: string[]) => void): Promise<void> {
        
        const loaders: DependencyLoader[] = [];

        for (let i = 0; i < deps.length; i++) {
            const depLoader: DependencyLoader = new DependencyLoader(i, deps[i], deps, cb);
            loaders.push(depLoader);
        }

        let sequence: Promise<void> = Promise.resolve();

        loaders.forEach((loader: DependencyLoader) => {
            sequence = sequence.then(() => {
                return loader.load();
            });
        });

        return sequence;
    }

}

class DependencyLoader {

    private _dep: string;
    private _deps: string[];
    private _cb: (index: number, dep: any, deps: string[]) => void;
    private _index: number;

    constructor(index: number, dep: string, deps: string[], cb: (index: number, dep: any, deps: string[]) => void) {
        this._dep = dep;
        this._deps = deps;
        this._cb = cb;
        this._index = index;
    }

    load(): Promise<void> {
        var that = this;

        return new Promise<void>((resolve) => {
            requirejs([that._dep], (dep: any) => {
                that._cb(that._index, dep, that._deps);
                resolve();
            });
        });
    }
}