declare module exjs {
}
declare module exjs {
    interface IProjectionFunc<T, TResult> {
        (t: T): TResult;
    }
    interface IProjectionIndexFunc<T, TResult> {
        (t: T, index: number): TResult;
    }
    interface IEnumerable<T> {
        getEnumerator(): IEnumerator<T>;
    }
    interface IEnumerableEx<T> extends IEnumerable<T> {
        aggregate<TAccumulate>(seed: TAccumulate, accumulator: (acc: TAccumulate, cur: T) => TAccumulate): TAccumulate;
        all(predicate: IProjectionFunc<T, boolean>): boolean;
        all(predicate: IProjectionIndexFunc<T, boolean>): boolean;
        any(predicate?: IProjectionFunc<T, boolean>): boolean;
        any(predicate?: IProjectionIndexFunc<T, boolean>): boolean;
        apply<T>(action: IProjectionFunc<T, any>): IEnumerableEx<T>;
        apply<T>(action: IProjectionIndexFunc<T, any>): IEnumerableEx<T>;
        at(index: number): T;
        average(selector?: (t: T) => number): number;
        concat(second: IEnumerable<T>): IEnumerableEx<T>;
        concat(second: T[]): IEnumerableEx<T>;
        count(predicate?: (t: T) => boolean): number;
        difference(second: IEnumerable<T>, comparer?: (f: T, s: T) => boolean): IDifference<T>;
        difference(second: T[], comparer?: (f: T, s: T) => boolean): IDifference<T>;
        distinct(comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        except(second: IEnumerable<T>, comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        except(second: T[], comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        first(match?: (t: T) => boolean): T;
        firstIndex(match?: (t: T) => boolean): number;
        forEach(action: (t: T) => any): any;
        groupBy<TKey>(keySelector: (t: T) => TKey, comparer?: (k1: TKey, k2: TKey) => boolean): IEnumerableEx<IGrouping<TKey, T>>;
        intersect(second: IEnumerable<T>, comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        intersect(second: T[], comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        join<TInner, TKey, TResult>(inner: IEnumerable<TInner>, outerKeySelector: (t: T) => TKey, innerKeySelector: (t: TInner) => TKey, resultSelector: (o: T, i: TInner) => TResult, comparer?: (k1: TKey, k2: TKey) => boolean): IEnumerableEx<TResult>;
        join<TInner, TKey, TResult>(inner: TInner[], outerKeySelector: (t: T) => TKey, innerKeySelector: (t: TInner) => TKey, resultSelector: (o: T, i: TInner) => TResult, comparer?: (k1: TKey, k2: TKey) => boolean): IEnumerableEx<TResult>;
        last(match?: (t: T) => boolean): T;
        lastIndex(match?: (t: T) => boolean): number;
        max(selector?: (t: T) => number): number;
        min(selector?: (t: T) => number): number;
        orderBy<TKey>(keySelector: (t: T) => TKey, comparer?: (f: TKey, s: TKey) => number): IOrderedEnumerable<T>;
        orderByDescending<TKey>(keySelector: (t: T) => TKey, comparer?: (f: TKey, s: TKey) => number): IOrderedEnumerable<T>;
        reverse(): IEnumerableEx<T>;
        select<TResult>(selector: IProjectionFunc<T, TResult>): IEnumerableEx<TResult>;
        select<TResult>(selector: IProjectionIndexFunc<T, TResult>): IEnumerableEx<TResult>;
        selectMany<TResult>(selector: (t: T) => IEnumerable<TResult>): IEnumerableEx<TResult>;
        selectMany<TResult>(selector: (t: T) => TResult[]): IEnumerableEx<TResult>;
        skip(count: number): IEnumerableEx<T>;
        skipWhile(predicate: IProjectionFunc<T, boolean>): IEnumerableEx<T>;
        skipWhile(predicate: IProjectionIndexFunc<T, boolean>): IEnumerableEx<T>;
        standardDeviation(selector?: (t: T) => number): number;
        sum(selector?: (t: T) => number): number;
        take(count: number): IEnumerableEx<T>;
        takeWhile(predicate: IProjectionFunc<T, boolean>): IEnumerableEx<T>;
        takeWhile(predicate: IProjectionIndexFunc<T, boolean>): IEnumerableEx<T>;
        toArray(): T[];
        toList(): IList<T>;
        toMap<TKey, TValue>(keySelector: (t: T) => TKey, valueSelector: (t: T) => TValue): IMap<TKey, TValue>;
        traverse(selector: (t: T) => T[]): IEnumerableEx<T>;
        traverse(selector: (t: T) => IEnumerable<T>): IEnumerableEx<T>;
        traverseUnique(selector: (t: T) => T[], matcher?: (t1: T, t2: T) => boolean): IEnumerableEx<T>;
        traverseUnique(selector: (t: T) => IEnumerable<T>, matcher?: (t1: T, t2: T) => boolean): IEnumerableEx<T>;
        union(second: IEnumerable<T>, comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        union(second: T[], comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        where(filter: (t: T) => boolean): IEnumerableEx<T>;
        zip<TSecond, TResult>(second: IEnumerable<TSecond>, resultSelector: (f: T, s: TSecond) => TResult): IEnumerableEx<TResult>;
        zip<TSecond, TResult>(second: TSecond[], resultSelector: (f: T, s: TSecond) => TResult): IEnumerableEx<TResult>;
    }
    interface IEnumerator<T> {
        current: T;
        moveNext(): boolean;
    }
    interface IOrderedEnumerable<T> extends IEnumerableEx<T> {
        thenBy<TKey>(keySelector: (t: T) => TKey, comparer?: (f: TKey, s: TKey) => number): IOrderedEnumerable<T>;
        thenByDescending<TKey>(keySelector: (t: T) => TKey, comparer?: (f: TKey, s: TKey) => number): IOrderedEnumerable<T>;
    }
    interface IGrouping<TKey, TElement> extends IEnumerableEx<TElement> {
        key: TKey;
    }
    interface IDifference<T> {
        intersection: IEnumerableEx<T>;
        aNotB: IEnumerableEx<T>;
        bNotA: IEnumerableEx<T>;
    }
    interface IList<T> extends IEnumerableEx<T> {
        toString(): string;
        toLocaleString(): string;
        pop(): T;
        push(...items: T[]): number;
        shift(): T;
        slice(start: number, end?: number): T[];
        sort(compareFn?: (a: T, b: T) => number): T[];
        splice(start: number): T[];
        splice(start: number, deleteCount: number, ...items: T[]): T[];
        unshift(...items: T[]): number;
        indexOf(searchElement: T, fromIndex?: number): number;
        lastIndexOf(searchElement: T, fromIndex?: number): number;
        every(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;
        some(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;
        forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
        map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
        filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[];
        reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T;
        reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
        reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T;
        reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
        length: number;
        [n: number]: T;
        remove(item: T): boolean;
        removeWhere(predicate: (t: T, index?: number) => boolean): IEnumerableEx<T>;
    }
    class Enumerable<T> implements IEnumerableEx<T> {
        constructor();
        public getEnumerator(): IEnumerator<T>;
        public aggregate<TAccumulate>(seed: TAccumulate, accumulator: (acc: TAccumulate, cur: T) => TAccumulate): TAccumulate;
        public all(predicate: IProjectionIndexFunc<T, boolean>): boolean;
        public any(predicate?: IProjectionIndexFunc<T, boolean>): boolean;
        public apply<T>(action: IProjectionIndexFunc<T, any>): IEnumerableEx<T>;
        public at(index: number): T;
        public average(selector?: (t: T) => number): number;
        public concat(second: IEnumerable<T>): IEnumerableEx<T>;
        public concat(second: T[]): IEnumerableEx<T>;
        public count(predicate?: (t: T) => boolean): number;
        public difference(second: IEnumerable<T>, comparer?: (f: T, s: T) => boolean): IDifference<T>;
        public difference(second: T[], comparer?: (f: T, s: T) => boolean): IDifference<T>;
        public distinct(comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        public except(second: IEnumerable<T>, comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        public except(second: T[], comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        public first(match?: (t: T) => boolean): T;
        public firstIndex(match?: (t: T) => boolean): number;
        public forEach(action: (t: T) => any): void;
        public groupBy<TKey>(keySelector: (t: T) => TKey, comparer?: (k1: TKey, k2: TKey) => boolean): IEnumerableEx<IGrouping<TKey, T>>;
        public intersect(second: IEnumerable<T>, comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        public intersect(second: T[], comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        public join<TInner, TKey, TResult>(inner: IEnumerable<TInner>, outerKeySelector: (t: T) => TKey, innerKeySelector: (t: TInner) => TKey, resultSelector: (o: T, i: TInner) => TResult, comparer?: (k1: TKey, k2: TKey) => boolean): IEnumerableEx<TResult>;
        public join<TInner, TKey, TResult>(inner: TInner[], outerKeySelector: (t: T) => TKey, innerKeySelector: (t: TInner) => TKey, resultSelector: (o: T, i: TInner) => TResult, comparer?: (k1: TKey, k2: TKey) => boolean): IEnumerableEx<TResult>;
        public last(match?: (t: T) => boolean): T;
        public lastIndex(match?: (t: T) => boolean): number;
        public max(selector?: (t: T) => number): number;
        public min(selector?: (t: T) => number): number;
        public orderBy<TKey>(keySelector: (t: T) => TKey, comparer?: (f: TKey, s: TKey) => number): IOrderedEnumerable<T>;
        public orderByDescending<TKey>(keySelector: (t: T) => TKey, comparer?: (f: TKey, s: TKey) => number): IOrderedEnumerable<T>;
        public reverse(): IEnumerableEx<T>;
        public select<TResult>(selector: IProjectionIndexFunc<T, TResult>): IEnumerableEx<TResult>;
        public selectMany<TResult>(selector: (t: T) => IEnumerable<TResult>): IEnumerableEx<TResult>;
        public selectMany<TResult>(selector: (t: T) => TResult[]): IEnumerableEx<TResult>;
        public skip(count: number): IEnumerableEx<T>;
        public skipWhile(predicate: IProjectionIndexFunc<T, boolean>): IEnumerableEx<T>;
        public standardDeviation(selector?: (t: T) => number): number;
        public sum(selector?: (t: T) => number): number;
        public take(count: number): IEnumerableEx<T>;
        public takeWhile(predicate: IProjectionIndexFunc<T, boolean>): IEnumerableEx<T>;
        public traverse(selector: (t: T) => T[]): IEnumerableEx<T>;
        public traverse(selector: (t: T) => IEnumerable<T>): IEnumerableEx<T>;
        public traverseUnique(selector: (t: T) => T[], uniqueMatch?: (t1: T, t2: T) => boolean): IEnumerableEx<T>;
        public traverseUnique(selector: (t: T) => IEnumerable<T>, matcher?: (t1: T, t2: T) => boolean): IEnumerableEx<T>;
        public toArray(): T[];
        public toMap<TKey, TValue>(keySelector: (t: T) => TKey, valueSelector: (t: T) => TValue): Map<TKey, TValue>;
        public toList(): IList<T>;
        public union(second: IEnumerable<T>, comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        public union(second: T[], comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        public where(filter: (t: T) => boolean): IEnumerableEx<T>;
        public zip<TSecond, TResult>(second: IEnumerable<TSecond>, resultSelector: (f: T, s: TSecond) => TResult): IEnumerableEx<TResult>;
        public zip<TSecond, TResult>(second: TSecond[], resultSelector: (f: T, s: TSecond) => TResult): IEnumerableEx<TResult>;
    }
}
declare var Symbol: any;
interface Iterator<T> {
    next(): IteratorResult<T>;
}
interface IteratorResult<T> {
    done: boolean;
    value: T;
}
declare module exjs {
}
declare module exjs {
    var Version: string;
}
declare module exjs {
}
interface Array<T> {
    en(): exjs.IEnumerableEx<T>;
}
declare module exjs {
}
declare module exjs {
}
declare module exjs {
}
declare module exjs {
}
interface Function {
    fromJson<T>(o: any, mappingOverrides?: any): T;
}
declare module exjs {
}
declare module exjs {
}
declare module exjs {
}
declare module exjs {
    class List<T> extends Enumerable<T> implements IList<T> {
        public toString(): string;
        public toLocaleString(): string;
        public pop(): T;
        public push(...items: T[]): number;
        public shift(): T;
        public slice(start: number, end?: number): T[];
        public sort(compareFn?: (a: T, b: T) => number): T[];
        public splice(start: number): T[];
        public splice(start: number, deleteCount: number, ...items: T[]): T[];
        public unshift(...items: T[]): number;
        public indexOf(searchElement: T, fromIndex?: number): number;
        public lastIndexOf(searchElement: T, fromIndex?: number): number;
        public every(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;
        public some(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;
        public forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
        public map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
        public filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[];
        public reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
        public reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
        public length: number;
        [n: number]: T;
        public remove(item: T): boolean;
        public removeWhere(predicate: (t: T, index?: number) => boolean): IEnumerableEx<T>;
    }
}
declare module exjs {
    interface IMap<TKey, TValue> {
        size: number;
        clear(): any;
        delete(key: TKey): boolean;
        entries(): IEnumerableEx<any[]>;
        forEach(callbackFn: (value: TValue, key: TKey, map?: IMap<TKey, TValue>) => void, thisArg?: any): any;
        get(key: TKey): TValue;
        has(key: TKey): boolean;
        keys(): IEnumerableEx<TKey>;
        set(key: TKey, value: TValue): any;
        values(): IEnumerableEx<TValue>;
    }
    class Map<TKey, TValue> implements IMap<TKey, TValue> {
        private _keys;
        private _values;
        public size : number;
        constructor();
        constructor(enumerable: any[][]);
        constructor(enumerable: IEnumerable<any[]>);
        public clear(): void;
        public delete(key: TKey): boolean;
        public entries(): IEnumerableEx<any[]>;
        public forEach(callbackFn: (value: TValue, key: TKey, map?: IMap<TKey, TValue>) => void, thisArg?: any): void;
        public get(key: TKey): TValue;
        public has(key: TKey): boolean;
        public keys(): IEnumerableEx<TKey>;
        public set(key: TKey, value: TValue): any;
        public values(): IEnumerableEx<TValue>;
    }
}
declare module exjs {
}
declare module exjs {
    function range(start: number, end: number, increment?: number): IEnumerableEx<number>;
}
declare module exjs {
}
declare module exjs {
    function round(value: number, digits?: number): number;
}
declare module exjs {
}
declare module exjs {
    function selectorEnumerator<T, TResult>(en: IEnumerable<T>): IEnumerator<TResult>;
    function selectorEnumerator<T, TResult>(arr: T[]): IEnumerator<TResult>;
}
declare module exjs {
}
declare module exjs {
}
declare module exjs {
}
declare module exjs {
}
declare module exjs {
}
declare module exjs {
    function en<T>(enu: IEnumerable<T>): IEnumerableEx<T>;
}
declare var ex: typeof exjs.en;
declare module exjs {
}
