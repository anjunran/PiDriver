class BlowsQueue {
    constructor() {
        this.Previous = 0;
        this.Current = 0;
    }
}

class PenetrationEventArgs {
    constructor(mode, blowLen, value) {
        this.Mode = mode;
        this.BlowLen = blowLen;
        this.Value = value;
    }
}

export default class Penetration {
    constructor() {
        this.Mode = 300;
        this.Value = 0;
        this.BlowLen = 0;
        this._countUpdates = new BlowsQueue();
        this.OnChange = null;
    }

    UpdatePenetration(mode, last, current) {
        if (mode < 0 || last < 0 || current < 0) {
            throw new Error("Invalid input. Mode, last, and current values must be non-negative.");
        }

        this._countUpdates.Previous = last;
        this._countUpdates.Current = current;
        this.Mode = mode;
        this.InnerCalculate();
    }

    InnerCalculate() {
        this.BlowLen = this._countUpdates.Current - this._countUpdates.Previous + 1;
        if (this.BlowLen > 0) {
            this.Value = this.Mode / this.BlowLen;
            if (this.OnChange) {
                this.OnChange(new PenetrationEventArgs(this.Mode, this.BlowLen, this.Value));
            }
        }
    }

    // Method to get current penetration mode
    getMode() {
        return this.Mode;
    }

    // Method to set penetration mode
    setMode(mode) {
        if (mode < 0) {
            throw new Error("Invalid input. Mode must be non-negative.");
        }

        this.Mode = mode;
    }

    // Method to get current penetration value
    getValue() {
        return this.Value;
    }

    // Method to get current blow length
    getBlowLen() {
        return this.BlowLen;
    }

    // Method to add blow count update
    addCountUpdate(countUpdate) {
        this._countUpdates.push(countUpdate);
    }

    // Method to remove last blow count update
    removeLastCountUpdate() {
        return this._countUpdates.pop();
    }

    // Method to clear all blow count updates
    clearCountUpdates() {
        this._countUpdates = new BlowsQueue();
    }

    // Method to set OnChange function
    setOnChangeFunction(onChangeFunction) {
        this.OnChange = onChangeFunction;
    }

    // Method to call OnChange function
    callOnChangeFunction() {
        if (this.OnChange) {
            this.OnChange(new PenetrationEventArgs(this.Mode, this.BlowLen, this.Value));
        }
    }

    // Method to reset penetration parameters
    resetPenetration() {
        this.Mode = 300;
        this.Value = 0;
        this.BlowLen = 0;
        this._countUpdates = new BlowsQueue();
    }
}
