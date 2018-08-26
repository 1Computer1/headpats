type JavaScriptType = 'undefined' | 'boolean' | 'number' | 'bigint' | 'string' | 'symbol' | 'function' | 'object';

type Predicate<T> = (value: T) => boolean;

type Consumer<T, R> = (value: T) => R;

interface HasInstance {
    [Symbol.hasInstance](instance: any): boolean;
}

export type PatternOf<T> = T extends PatternMatcher
    ? PatternMatcher
    : T extends (infer U)[]
        ? Patterns.ArrayPattern<U>
        : T extends Map<infer K, infer V>
            ? Patterns.MapPattern<K, V>
            : T extends Object
                ? Patterns.ObjectPattern<T>
                : Patterns.EqualPattern<T>;

export interface PatternMatchResult {
    matched: boolean;
    extracted?: object;
}

export interface PatternMatcher {
    [extractor](value: any, previousExtracted: object): PatternMatchResult;
}

export type Cases = ((value: any) => any) & {
    cases: [any, Consumer<object, any>][];
    case(pattern: any, cb: Consumer<object, any>): Cases;
    caseGuarded(pattern: any, predicated: Predicate<object>, cb: Consumer<object, any>): Cases;
};

export type Clauses = ((value: any) => any) & {
    clauses: [Patterns.Pattern, Consumer<object, any>][];
    clause(patterns: any[], cb: Consumer<object, any>): Clauses;
    clause(patterns: any[], restPattern: any, cb: Consumer<object, any>): Clauses;
    clauseGuarded(patterns: any[], predicate: Predicate<object>, cb: Consumer<object, any>): Clauses;
    clauseGuarded(patterns: any[], restPattern: any, predicate: Predicate<object>, cb: Consumer<object, any>): Clauses;
};

export const extractor: unique symbol;
export const ignored: unique symbol;
export const rest: unique symbol;

declare namespace Functions {
    export function cases(): Cases;
    export function clauses(): Clauses;
    export function matcher(pattern: any): (value: any) => object;
    export function tester(pattern: any): (value: any) => boolean;
}

export { Functions as functions };

declare namespace Patterns {
    export abstract class Pattern implements PatternMatcher {
        public abstract [extractor](value: any, previousExtracted: object): PatternMatchResult;
        public match(value: any): object;
        public test(value: any): boolean;

        public static patternOf<T>(pattern: T): PatternOf<T>;
    }

    export class ArrayPattern<T> extends Pattern {
        public constructor(patterns: Array<T>, restPattern?: any);

        public patterns: Array<T>;
        public rest: boolean;
        public restPattern?: any;

        public [extractor](value: any, previousExtracted: object): PatternMatchResult;
    }

    export class BindPattern extends Pattern {
        public constructor(pattern: any, id: PropertyKey);

        public id: PropertyKey;
        public pattern: any;

        public [extractor](value: any, previousExtracted: object): PatternMatchResult;
    }

    export class EqualPattern<T> extends Pattern {
        public constructor(value: T);

        public value: T;

        public [extractor](value: any, previousExtracted: object): PatternMatchResult;
    }

    export class GuardedPattern extends Pattern {
        public constructor(pattern: any, predicate: Predicate<object>);

        public pattern: any;
        public predicate: Predicate<object>;

        public [extractor](value: any, previousExtracted: object): PatternMatchResult;
    }

    export class IDPattern extends Pattern {
        public constructor(id: PropertyKey);

        public id: PropertyKey;

        public [extractor](value: any, previousExtracted: object): PatternMatchResult;
    }

    export class IgnorePattern extends Pattern {
        public constructor();

        public [extractor](value: any, previousExtracted: object): PatternMatchResult;
    }

    export class InstancePattern<T extends HasInstance> extends Pattern {
        public constructor(Class: T, pattern: any);

        public Class: T;
        public pattern: any;

        public [extractor](value: any, previousExtracted: object): PatternMatchResult;
    }

    export class MapPattern<K, V> extends Pattern {
        public constructor(patterns: Map<K, V>, restPattern?: any);

        public patterns: Map<K, V>;
        public rest: boolean;
        public restPattern?: any;

        public [extractor](value: any, previousExtracted: object): PatternMatchResult;
    }

    export class MultiplePattern<T> extends Pattern {
        public constructor(...values: T[]);

        public values: T[];

        public [extractor](value: any, previousExtracted: object): PatternMatchResult;
    }

    export class ObjectPattern<T extends Object> extends Pattern {
        public constructor(patterns: T, restPattern?: any);

        public patterns: T;
        public rest: boolean;
        public restPattern?: any;

        public [extractor](value: any, previousExtracted: object): PatternMatchResult;
    }

    export class PreguardedPattern extends Pattern {
        public constructor(predicate: Predicate<any>, pattern: any);

        public pattern: any;
        public predicate: Predicate<any>;

        public [extractor](value: any, previousExtracted: object): PatternMatchResult;
    }

    export class RangePattern<T> extends Pattern {
        public constructor(lowerBound: T, upperBound: T, exclusive?: boolean);

        public exclusive: boolean;
        public lowerBound: T;
        public upperBound: T;

        public [extractor](value: any, previousExtracted: object): PatternMatchResult;
    }

    export class StringPattern extends Pattern {
        public constructor(string: string, restPattern: any);

        public restPattern: any;
        public string: string;

        public [extractor](value: any, previousExtracted: object): PatternMatchResult;
    }

    export class TypePattern<T extends JavaScriptType> extends Pattern {
        public constructor(type: T, pattern: any);

        public pattern: any;
        public type: T;

        public [extractor](value: any, previousExtracted: object): PatternMatchResult;
    }

    export class ViewPattern<T> extends Pattern {
        public constructor(fn: (value: any) => T, pattern: any);

        public fn: (value: any) => T;
        public pattern: any;

        public [extractor](value: any, previousExtracted: object): PatternMatchResult;
    }
}

export { Patterns as patterns };

declare namespace Is {
    export function array<T>(patterns: Array<T>, restPattern?: any): Patterns.ArrayPattern<T>;
    export function bind(pattern: any, id: PropertyKey): Patterns.BindPattern;
    export function equal<T>(value: T): Patterns.EqualPattern<T>;
    export function guarded(pattern: any, predicate: Predicate<object>): Patterns.GuardedPattern;
    export function id(id: PropertyKey): Patterns.IDPattern;
    export function ignore(): Patterns.IgnorePattern;
    export function instance<T extends HasInstance>(Class: T, pattern: any): Patterns.InstancePattern<T>;
    export function map<K, V>(patterns: Map<K, V>, restPattern?: any): Patterns.MapPattern<K, V>;
    export function oneOf<T>(...values: T[]): Patterns.MultiplePattern<T>;
    export function object<T extends Object>(patterns: T, restPattern?: any): Patterns.ObjectPattern<T>;
    export function preguarded(predicate: Predicate<any>, pattern: any): Patterns.PreguardedPattern;
    export function inRange<T>(lowerBound: T, upperBound: T, exclusive?: boolean): Patterns.RangePattern<T>;
    export function string(string: string, restPattern: any): Patterns.StringPattern;
    export function type<T extends JavaScriptType>(type: T, pattern: any): Patterns.TypePattern<T>;
    export function view<T>(fn: (value: any) => T, pattern: any): Patterns.ViewPattern<T>;
}

export { Is as is };

export const $: ((id: PropertyKey) => Patterns.IDPattern) & { [key: string]: Patterns.IDPattern };
export function $$<T extends HasInstance>(Class: T, pattern: any): Patterns.InstancePattern<T>;
export const _: Patterns.IgnorePattern;

declare function kase(pattern: any, cb: Consumer<object, any>): Cases;
export function caseGuarded(pattern: any, predicated: Predicate<object>, cb: Consumer<object, any>): Cases;
export { kase as case };

export function clause(patterns: any[], cb: Consumer<object, any>): Clauses;
export function clause(patterns: any[], restPattern: any, cb: Consumer<object, any>): Clauses;
export function clauseGuarded(patterns: any[], predicate: Predicate<object>, cb: Consumer<object, any>): Clauses;
export function clauseGuarded(patterns: any[], restPattern: any, predicate: Predicate<object>, cb: Consumer<object, any>): Clauses;

export function match(pattern: any, value: any): object;
export function test(pattern: any, value: any): boolean;
