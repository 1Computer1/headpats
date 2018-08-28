class UnionBase {
    constructor() {
        if (new.target === UnionBase) {
            throw new TypeError('This class may not be instantiated');
        }
    }
}

module.exports = UnionBase;
