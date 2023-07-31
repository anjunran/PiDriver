export default class Counter {
    constructor() {
        this._counterValue = 0;
        this._onStart = null;
        this._onQueue = null;

        this.reset();
    }

    increment() {
        this._counterValue++;
        if (this._onStart) this._onStart(this._counterValue);
    }

    queue() {
        this.increment();
        if (this._onQueue) this._onQueue(this._counterValue);
    }

    reset(initialValue = 0) {
        if (initialValue < 0) {
            throw new Error("Initial value cannot be negative");
        }
        this._counterValue = initialValue;
        if (this._onStart) this._onStart(this._counterValue);
    }

    get counterValue() {
        return this._counterValue;
    }

    set onStart(callback) {
        this._onStart = callback;
    }

    get onStart() {
        return this._onStart;
    }

    set onQueue(callback) {
        this._onQueue = callback;
    }

    get onQueue() {
        return this._onQueue;
    }
}
