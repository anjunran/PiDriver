export default class TimerIO {
    constructor() {
        const now = new Date();
        this.TimeTimestamp = now.toTimeString().split(' ')[0];
        this.DateTimeTimestamp = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];
        this.DateTimestamp = now.toISOString().split('T')[0];
    }

    getTimestamp(format = "default") {
        switch (format) {
            case "time":
                return this.TimeTimestamp;
            case "date":
                return this.DateTimestamp;
            default:
                return this.DateTimeTimestamp;
        }
    }
}
