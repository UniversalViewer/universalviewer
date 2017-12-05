declare namespace exjs {
    var version: string;
}
declare namespace exjs {
}
declare namespace exjs {
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
        append(...items: T[]): IEnumerableEx<T>;
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
        prepend(...items: T[]): IEnumerableEx<T>;
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
        getEnumerator(): IEnumerator<T>;
        aggregate<TAccumulate>(seed: TAccumulate, accumulator: (acc: TAccumulate, cur: T) => TAccumulate): TAccumulate;
        all(predicate: IProjectionIndexFunc<T, boolean>): boolean;
        any(predicate?: IProjectionIndexFunc<T, boolean>): boolean;
        append(...items: T[]): IEnumerableEx<T>;
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
        forEach(action: (t: T) => any): void;
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
        prepend(...items: T[]): IEnumerableEx<T>;
        reverse(): IEnumerableEx<T>;
        select<TResult>(selector: IProjectionIndexFunc<T, TResult>): IEnumerableEx<TResult>;
        selectMany<TResult>(selector: (t: T) => IEnumerable<TResult>): IEnumerableEx<TResult>;
        selectMany<TResult>(selector: (t: T) => TResult[]): IEnumerableEx<TResult>;
        skip(count: number): IEnumerableEx<T>;
        skipWhile(predicate: IProjectionIndexFunc<T, boolean>): IEnumerableEx<T>;
        standardDeviation(selector?: (t: T) => number): number;
        sum(selector?: (t: T) => number): number;
        take(count: number): IEnumerableEx<T>;
        takeWhile(predicate: IProjectionIndexFunc<T, boolean>): IEnumerableEx<T>;
        traverse(selector: (t: T) => T[]): IEnumerableEx<T>;
        traverse(selector: (t: T) => IEnumerable<T>): IEnumerableEx<T>;
        traverseUnique(selector: (t: T) => T[], uniqueMatch?: (t1: T, t2: T) => boolean): IEnumerableEx<T>;
        traverseUnique(selector: (t: T) => IEnumerable<T>, matcher?: (t1: T, t2: T) => boolean): IEnumerableEx<T>;
        toArray(): T[];
        toMap<TKey, TValue>(keySelector: (t: T) => TKey, valueSelector: (t: T) => TValue): IMap<TKey, TValue>;
        toList(): IList<T>;
        union(second: IEnumerable<T>, comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        union(second: T[], comparer?: (f: T, s: T) => boolean): IEnumerableEx<T>;
        where(filter: (t: T) => boolean): IEnumerableEx<T>;
        zip<TSecond, TResult>(second: IEnumerable<TSecond>, resultSelector: (f: T, s: TSecond) => TResult): IEnumerableEx<TResult>;
        zip<TSecond, TResult>(second: TSecond[], resultSelector: (f: T, s: TSecond) => TResult): IEnumerableEx<TResult>;
    }
}
declare namespace exjs {
}
interface Symbol {
    toString(): string;
    valueOf(): symbol;
}
interface SymbolConstructor {
    readonly prototype: Symbol;
    (description?: string | number): symbol;
    for(key: string): symbol;
    keyFor(sym: symbol): string | undefined;
}
declare var Symbol: SymbolConstructor;
interface SymbolConstructor {
    readonly iterator: symbol;
}
interface IteratorResult<T> {
    done: boolean;
    value: T;
}
interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    return?(value?: any): IteratorResult<T>;
    throw?(e?: any): IteratorResult<T>;
}
interface Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
}
interface IterableIterator<T> extends Iterator<T> {
    [Symbol.iterator](): IterableIterator<T>;
}
declare var global: any;
declare var window: Window;
declare namespace exjs {
    class Map<TKey, TValue> implements IMap<TKey, TValue> {
        private _keys;
        private _values;
        readonly size: number;
        constructor();
        constructor(enumerable: any[][]);
        constructor(enumerable: IEnumerable<any[]>);
        clear(): void;
        delete(key: TKey): boolean;
        entries(): IEnumerableEx<any[]>;
        forEach(callbackFn: (value: TValue, key: TKey, map?: IMap<TKey, TValue>) => void, thisArg?: any): void;
        get(key: TKey): TValue;
        has(key: TKey): boolean;
        keys(): IEnumerableEx<TKey>;
        set(key: TKey, value: TValue): any;
        values(): IEnumerableEx<TValue>;
    }
}
declare namespace exjs {
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
}
declare namespace exjs {
    function anonymous<T>(iterator: (en: IEnumerator<T>) => boolean): IEnumerableEx<T>;
}
declare namespace exjs {
}
declare namespace exjs {
}
interface Array<T> {
    en(): exjs.IEnumerableEx<T>;
}
declare namespace exjs {
}
declare namespace exjs {
}
declare namespace exjs {
}
declare namespace exjs {
}
interface Function {
    fromJson<T>(o: any, mappingOverrides?: any): T;
}
declare namespace exjs {
}
declare namespace exjs {
}
declare namespace exjs {
}
declare namespace exjs {
    class List<T> extends Enumerable<T> implements IList<T> {
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
        reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
        reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
        length: number;
        [n: number]: T;
        remove(item: T): boolean;
        removeWhere(predicate: (t: T, index?: number) => boolean): IEnumerableEx<T>;
    }
}
declare namespace exjs {
}
declare namespace exjs {
}
declare namespace exjs {
    function range(start: number, end: number, increment?: number): IEnumerableEx<number>;
}
declare namespace exjs {
}
declare namespace exjs {
    function round(value: number, digits?: number): number;
}
declare namespace exjs {
}
declare namespace exjs {
    function selectorEnumerator<T, TResult>(en: IEnumerable<T>): IEnumerator<TResult>;
    function selectorEnumerator<T, TResult>(arr: T[]): IEnumerator<TResult>;
}
declare namespace exjs {
}
declare namespace exjs {
}
declare namespace exjs {
}
declare namespace exjs {
}
declare namespace exjs {
}
declare namespace exjs {
    function en<T>(enu: IEnumerable<T>): IEnumerableEx<T>;
}
declare var ex: typeof exjs.en;
declare namespace exjs {
}
