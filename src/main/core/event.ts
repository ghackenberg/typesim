export class Event {
    constructor(public time: number, public process: () => void) {

    }
}