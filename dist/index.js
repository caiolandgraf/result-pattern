export class Ok {
    constructor(value) {
        this.value = value;
        this.isOk = true;
        this.isFail = false;
    }
    map(mapFn) {
        return new Ok(mapFn(this.value));
    }
    flatMap(mapFn) {
        return mapFn(this.value);
    }
    mapFails(mapFn) {
        return new Ok(this.value);
    }
    flip() {
        return new Fail(this.value);
    }
}
export class Fail {
    constructor(value) {
        this.value = value;
        this.isOk = false;
        this.isFail = true;
    }
    map(mapFn) {
        return new Fail(this.value);
    }
    flatMap(mapFn) {
        return new Fail(this.value);
    }
    mapFails(mapFn) {
        return new Fail(mapFn(this.value));
    }
    flip() {
        return new Ok(this.value);
    }
}
export var ResultUtils;
(function (ResultUtils) {
    function combine(...results) {
        const fails = results.filter((r) => r.isFail);
        if (fails.length > 0) {
            const failValues = fails.map((f) => f.value);
            return new Fail(failValues);
        }
        const okValues = results.map((r) => r.value);
        return new Ok(okValues);
    }
    ResultUtils.combine = combine;
})(ResultUtils || (ResultUtils = {}));
//# sourceMappingURL=index.js.map