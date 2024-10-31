export default class SprintError extends Error {
    status: number

    constructor(message, status) {
        super(message);
        this.status = status ?? 500;
    }

    static BadDates() {
        return new SprintError("Часові межі спринту не можуть бути ширшими за часові межі проєкту", 400);
    }
}