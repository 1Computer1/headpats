const UnionBase = require('./UnionBase');

module.exports = (unionName, ...types) => {
    const { [unionName]: TaggedUnion } = {
        [unionName]: class extends UnionBase {
            constructor() {
                super();
                if (new.target === TaggedUnion) {
                    throw new TypeError('This class may not be instantiated');
                }
            }
        }
    };

    for (const pair of types) {
        const [name, kind = 'value'] = Array.isArray(pair) ? pair : [pair];
        if (!(kind === 'array' || kind === 'value')) {
            throw new TypeError('Type kind must be one of "array" or "value"');
        }

        const { [name]: Type } = kind === 'array'
            ? {
                [name]: class extends TaggedUnion {
                    constructor(...args) {
                        super();
                        this.value = args;
                    }
                }
            }
            : {
                [name]: class extends TaggedUnion {
                    constructor(value) {
                        super();
                        this.value = value;
                    }
                }
            };

        TaggedUnion[name] = Type;
    }

    return TaggedUnion;
};
