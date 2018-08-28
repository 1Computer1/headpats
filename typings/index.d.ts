type JavaScriptType = 'undefined' | 'boolean' | 'number' | 'bigint' | 'string' | 'symbol' | 'function' | 'object';

type Predicate<T> = (value: T) => boolean;

type Function<T, R> = (value: T) => R;

interface HasInstance {
    [Symbol.hasInstance](instance: any): boolean;
}

declare class UnionBase {}

declare class TaggedType extends UnionBase {
    constructor(...args: any[]);

    public value: any;
}

export function union<K extends string>(unionName: string, ...types: (K | [K, ('array' | 'value')?])[]): typeof UnionBase & { [Key in K]: typeof TaggedType };

export type PatternOf<T> = T extends PatternMatcher ? PatternMatcher
    : T extends any[] ? Patterns.ArrayPattern
    : T extends Map<infer K, any> ? Patterns.MapPattern<K>
    : T extends Object ? Patterns.ObjectPattern
    : Patterns.EqualPattern<T>;

export interface PatternMatchResult {
    matched: boolean;
    extracted?: any;
}

export interface PatternMatcher {
    [ignored]?: boolean;
    [extractor](value: any, previousExtracted: any): PatternMatchResult;
}

export type Cases<R1> = ((value: any) => R1) & {
    cases: [PatternMatcher, Function<any, any>][];
    case<R2>(pattern: any, cb: Function<any, R2>): Cases<R1 | R2>;
    caseGuarded<R2>(pattern: any, predicate: Predicate<any>, cb: Function<any, R2>): Cases<R1 | R2>;
};

export type Clauses<R1> = ((...values: any[]) => R1) & {
    clauses: [Patterns.Pattern, Function<any, R1>][];

    // TypeScript does not support having types separate last argument so we have to have a lot of overloads.
    clause<R2>(cb: Function<any, R2>): Clauses<R1 | R2>;
    clause<R2>(a1: any, cb: Function<any, R2>): Clauses<R1 | R2>;
    clause<R2>(a1: any, a2: any, cb: Function<any, R2>): Clauses<R1 | R2>;
    clause<R2>(a1: any, a2: any, a3: any, cb: Function<any, R2>): Clauses<R1 | R2>;
    clause<R2>(a1: any, a2: any, a3: any, a4: any, cb: Function<any, R2>): Clauses<R1 | R2>;
    clause<R2>(a1: any, a2: any, a3: any, a4: any, a5: any, cb: Function<any, R2>): Clauses<R1 | R2>;
    clause<R2>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, cb: Function<any, R2>): Clauses<R1 | R2>;
    clause<R2>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, cb: Function<any, R2>): Clauses<R1 | R2>;
    clause<R2>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, cb: Function<any, R2>): Clauses<R1 | R2>;
    clause<R2>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, cb: Function<any, R2>): Clauses<R1 | R2>;
    clause<R2>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, cb: Function<any, R2>): Clauses<R1 | R2>;

    clauseGuarded<R2>(predicate: Predicate<any>, cb: Function<any, R2>): Clauses<R1 | R2>;
    clauseGuarded<R2>(a1: any, predicate: Predicate<any>, cb: Function<any, R2>): Clauses<R1 | R2>;
    clauseGuarded<R2>(a1: any, a2: any, predicate: Predicate<any>, cb: Function<any, R2>): Clauses<R1 | R2>;
    clauseGuarded<R2>(a1: any, a2: any, a3: any, predicate: Predicate<any>, cb: Function<any, R2>): Clauses<R1 | R2>;
    clauseGuarded<R2>(a1: any, a2: any, a3: any, a4: any, predicate: Predicate<any>, cb: Function<any, R2>): Clauses<R1 | R2>;
    clauseGuarded<R2>(a1: any, a2: any, a3: any, a4: any, a5: any, predicate: Predicate<any>, cb: Function<any, R2>): Clauses<R1 | R2>;
    clauseGuarded<R2>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, predicate: Predicate<any>, cb: Function<any, R2>): Clauses<R1 | R2>;
    clauseGuarded<R2>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, predicate: Predicate<any>, cb: Function<any, R2>): Clauses<R1 | R2>;
    clauseGuarded<R2>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, predicate: Predicate<any>, cb: Function<any, R2>): Clauses<R1 | R2>;
    clauseGuarded<R2>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, predicate: Predicate<any>, cb: Function<any, R2>): Clauses<R1 | R2>;
    clauseGuarded<R2>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, predicate: Predicate<any>, cb: Function<any, R2>): Clauses<R1 | R2>;
};

export const extractor: unique symbol;
export const ignored: unique symbol;
export const rest: unique symbol;

declare namespace Functions {
    export function cases<R>(): Cases<R>;
    export function clauses<R>(): Clauses<R>;
    export function matcher(pattern: any): (value: any) => any;
    export function tester(pattern: any): (value: any) => boolean;
}

export { Functions as functions };

declare namespace Patterns {
    export abstract class Pattern implements PatternMatcher {
        public abstract [extractor](value: any, previousExtracted: any): PatternMatchResult;
        public match(value: any): any;
        public test(value: any): boolean;

        public static patternOf<T>(pattern: T): PatternOf<T>;
        public static patternOfArray(array: any[]): Patterns.ArrayPattern;
        public static patternOfMap<K>(map: Map<K, any>): Patterns.MapPattern<K>;
        public static patternOfObject(object: any): Patterns.ObjectPattern;
        public static patternOfPrimitive<T>(value: T): Patterns.EqualPattern<T>;
    }

    export class ArrayPattern extends Pattern {
        public constructor(patterns: any[], restPattern?: any);

        public patterns: PatternMatcher[];
        public rest: boolean;
        public restPattern?: PatternMatcher;

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }

    export class BindPattern extends Pattern {
        public constructor(pattern: any, id: PropertyKey);

        public id: PropertyKey;
        public pattern: PatternMatcher;

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }

    export class EqualPattern<T> extends Pattern {
        public constructor(value: T);

        public value: T;

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }

    export class GuardedPattern extends Pattern {
        public constructor(pattern: any, predicate: Predicate<any>);

        public pattern: PatternMatcher;
        public predicate: Predicate<any>;

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }

    export class IDPattern extends Pattern {
        public constructor(id: PropertyKey);

        public id: PropertyKey;

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }

    export class IgnorePattern extends Pattern {
        public constructor();

        public [ignored]: true;

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }

    export class InstancePattern<T extends HasInstance> extends Pattern {
        public constructor(Class: T, pattern: any);

        public Class: T;
        public pattern: PatternMatcher;

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }

    export class MapPattern<K> extends Pattern {
        public constructor(patterns: Map<K, any>, restPattern?: any);

        public patterns: Map<K, PatternMatcher>;
        public rest: boolean;
        public restPattern?: PatternMatcher;

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }

    export class MultiplePattern<T> extends Pattern {
        public constructor(...values: T[]);

        public values: T[];

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }

    export class ObjectPattern extends Pattern {
        public constructor(patterns: object, restPattern?: any);

        public patterns: { [key: string]: PatternMatcher };
        public rest: boolean;
        public restPattern?: PatternMatcher;

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }

    export class PreguardedPattern extends Pattern {
        public constructor(predicate: Predicate<any>, pattern: any);

        public pattern: PatternMatcher;
        public predicate: Predicate<any>;

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }

    export class RangePattern<T> extends Pattern {
        public constructor(lowerBound: T, upperBound: T, exclusive?: boolean);

        public exclusive: boolean;
        public lowerBound: T;
        public upperBound: T;

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }

    export class StringPattern extends Pattern {
        public constructor(string: string, restPattern: any);

        public restPattern: PatternMatcher;
        public string: string;

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }

    export class TagPattern<T extends typeof UnionBase> extends Pattern {
        public constructor(Class: T, pattern: any);

        public Class: T;
        public pattern: PatternMatcher;

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }

    export class TypePattern<T extends JavaScriptType> extends Pattern {
        public constructor(type: T, pattern: any);

        public pattern: PatternMatcher;
        public type: T;

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }

    export class ViewPattern<T> extends Pattern {
        public constructor(fn: (value: any) => T, pattern: any);

        public fn: (value: any) => T;
        public pattern: PatternMatcher;

        public [extractor](value: any, previousExtracted: any): PatternMatchResult;
    }
}

export { Patterns as patterns };

declare namespace Aliases {
    export function array<T>(patterns: T[], restPattern?: any): Patterns.ArrayPattern;
    export function bind(pattern: any, id: PropertyKey): Patterns.BindPattern;
    export function equal<T>(value: T): Patterns.EqualPattern<T>;
    export function guarded(pattern: any, predicate: Predicate<object>): Patterns.GuardedPattern;
    export function id(id: PropertyKey): Patterns.IDPattern;
    export function ignore(): Patterns.IgnorePattern;
    export function instance<T extends HasInstance>(Class: T, pattern: any): Patterns.InstancePattern<T>;
    export function map<K>(patterns: Map<K, any>, restPattern?: any): Patterns.MapPattern<K>;
    export function oneOf<T>(...values: T[]): Patterns.MultiplePattern<T>;
    export function object(patterns: object, restPattern?: any): Patterns.ObjectPattern;
    export function preguarded(predicate: Predicate<any>, pattern: any): Patterns.PreguardedPattern;
    export function inRange<T>(lowerBound: T, upperBound: T, exclusive?: boolean): Patterns.RangePattern<T>;
    export function string(string: string, restPattern: any): Patterns.StringPattern;
    export function tag<T extends typeof UnionBase>(Class: T, pattern: any): Patterns.TagPattern<T>;
    export function type<T extends JavaScriptType>(type: T, pattern: any): Patterns.TypePattern<T>;
    export function view<T>(fn: (value: any) => T, pattern: any): Patterns.ViewPattern<T>;
}

export { Aliases as is };

export const $: ((id: PropertyKey) => Patterns.IDPattern) & { [key: string]: Patterns.IDPattern };
export function $$<T extends (JavaScriptType | typeof UnionBase | HasInstance)>(thing: T, pattern: any):
    T extends JavaScriptType ? Patterns.TypePattern<T>
    : T extends typeof UnionBase ? Patterns.TagPattern<T>
    : T extends HasInstance ? Patterns.InstancePattern<T>
    : never;
export const _: Patterns.IgnorePattern;

declare function kase<T>(pattern: any, cb: Function<any, T>): Cases<T>;
export function caseGuarded<T>(pattern: any, predicate: Predicate<any>, cb: Function<any, T>): Cases<T>;
export { kase as case };

// TypeScript does not support having types separate last argument so we have to have a lot of overloads.
export function clause<T>(cb: Function<any, T>): Clauses<T>;
export function clause<T>(a1: any, cb: Function<any, T>): Clauses<T>;
export function clause<T>(a1: any, a2: any, cb: Function<any, T>): Clauses<T>;
export function clause<T>(a1: any, a2: any, a3: any, cb: Function<any, T>): Clauses<T>;
export function clause<T>(a1: any, a2: any, a3: any, a4: any, cb: Function<any, T>): Clauses<T>;
export function clause<T>(a1: any, a2: any, a3: any, a4: any, a5: any, cb: Function<any, T>): Clauses<T>;
export function clause<T>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, cb: Function<any, T>): Clauses<T>;
export function clause<T>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, cb: Function<any, T>): Clauses<T>;
export function clause<T>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, cb: Function<any, T>): Clauses<T>;
export function clause<T>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, cb: Function<any, T>): Clauses<T>;
export function clause<T>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, cb: Function<any, T>): Clauses<T>;

export function clauseGuarded<T>(predicate: Predicate<any>, cb: Function<any, T>): Clauses<T>;
export function clauseGuarded<T>(a1: any, predicate: Predicate<any>, cb: Function<any, T>): Clauses<T>;
export function clauseGuarded<T>(a1: any, a2: any, predicate: Predicate<any>, cb: Function<any, T>): Clauses<T>;
export function clauseGuarded<T>(a1: any, a2: any, a3: any, predicate: Predicate<any>, cb: Function<any, T>): Clauses<T>;
export function clauseGuarded<T>(a1: any, a2: any, a3: any, a4: any, predicate: Predicate<any>, cb: Function<any, T>): Clauses<T>;
export function clauseGuarded<T>(a1: any, a2: any, a3: any, a4: any, a5: any, predicate: Predicate<any>, cb: Function<any, T>): Clauses<T>;
export function clauseGuarded<T>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, predicate: Predicate<any>, cb: Function<any, T>): Clauses<T>;
export function clauseGuarded<T>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, predicate: Predicate<any>, cb: Function<any, T>): Clauses<T>;
export function clauseGuarded<T>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, predicate: Predicate<any>, cb: Function<any, T>): Clauses<T>;
export function clauseGuarded<T>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, predicate: Predicate<any>, cb: Function<any, T>): Clauses<T>;
export function clauseGuarded<T>(a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any, a8: any, a9: any, a10: any, predicate: Predicate<any>, cb: Function<any, T>): Clauses<T>;

export function match(pattern: any, value: any): any;
export function test(pattern: any, value: any): boolean;
