class WaitTime {
    constructor(public until: number) {

    }
}
class WaitEvent {
    constructor(public event: Event) {
        
    }
}
class WaitResource {
    constructor(public resource: Resource, public units: number) {
        
    }
}
class WaitProcess {
    constructor(public process: Generator) {

    }
}

export class Random {
    
    next(min = Number.MIN_VALUE, max = Number.MAX_VALUE) {
        return Math.round(min + Math.random() * (max - min))
    }

}

export class Environment {
    
    processes: Generator<any>[] = []

    resources: Resource[] = []
    
    time: number = 0

    process(process: Generator<any>) {
        this.processes.push(process)
    }
    wait(value: number | Event | Generator<any>) {
        if (typeof value == "number") {
            return new WaitTime(this.time + value)
        } else if (value instanceof Event) {
            return new WaitEvent(value)
        } else {
            return new WaitProcess(value)
        }
    }
    run(until = Number.MAX_VALUE) {
        for (const process of this.processes) {
            const { done, value } = process.next()
            if (!done) {
                if (typeof value == "object") {
                    if (value instanceof WaitTime) {

                    } else if (value instanceof WaitEvent) {

                    } else if (value instanceof WaitProcess) {

                    } else if (value instanceof WaitResource) {

                    }
                }
            }
        }
    }

}

export class Resource {

    constructor(public environment: Environment, public capacity = 1) {

    }
    require(units = 1) {
        return new WaitResource(this, units)
    }
    release(units = 1) {

    }

}

export class Event {

}