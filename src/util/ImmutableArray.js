class ImmutableArray {
    static remove(array, index) {
        const a = ImmutableArray.concat(array);
        a.splice(index, 1);
        return a;
    }

    static concat(...arrays) {
        return [].concat(...arrays);
    }
}

module.exports = ImmutableArray;
