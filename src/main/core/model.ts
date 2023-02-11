import { Component } from "./component.js"
import { Event } from "./event.js"

export class Model {

    private static _INSTANCES: Model[] = []
    private static _INSTANCE: Model

    public static get INSTANCES() {
        return Model._INSTANCES
    }

    public static get INSTANCE() {
        return Model._INSTANCE
    }

    private staticComponents: Component<any, any>[] = []
    private dynamicComponents: Component<any, any>[]

    private updates: Map<Component<any, any>, number[]>
    private events: Event[]
    private _time: number
    private _progress: number
    private _simulation: boolean = false

    constructor() {
        Model._INSTANCES.push(this)
        Model._INSTANCE = this
    }

    addStaticComponent(component: Component<any, any>) {
        this.staticComponents.push(component)
    }
    addDynamicComponent(component: Component<any, any>) {
        this.dynamicComponents.push(component)
    }

    private searchBinary<T>(array: T[], comparator: (a: T, b: T) => number, value: T) {
        let lower = 0
        let upper = array.length - 1
        while (lower < upper) {
            let middle = Math.floor((lower + upper) / 2)
            let delta = comparator(array[middle], value)
            if (delta < 0) {
                lower = middle + 1
            } else if (delta > 0) {
                upper = middle - 1
            } else {
                return lower
            }
        }
        return lower
    }
    private hasBinary<T>(array: T[], comparator: (a: T, b: T) => number, value: T) {
        if (array.length == 0) {
            return false
        } else {
            const index = this.searchBinary(array, comparator, value)
            return comparator(array[index], value) == 0
        }
    }
    private insertBinary<T>(array: T[], comparator: (a: T, b: T) => number, value: T) {
        const index = this.searchBinary(array, comparator, value)
        array.splice(index, 0, value)
    }

    scheduleUpdate(time: number, component: Component<any, any>) {
        // Check updates
        if (!this.updates.has(component)) {
            this.updates.set(component, [])
        }
        if (this.hasBinary(this.updates.get(component), (a, b) => a - b, time)) {
            return
        }
        // Update updates
        this.insertBinary(this.updates.get(component), (a, b) => a - b, time)
        // Update events
        this.insertBinary(this.events, (a, b) => a.time - b.time, new Event(time, component))
    }

    get time() {
        return this._time
    }
    private set time(value: number) {
        this._time = value
    }

    get progress() {
        return this._progress
    }
    private set progress(value: number) {
        this._progress = value
    }

    get simulation() {
        return this._simulation
    }
    private set simulation(value: boolean) {
        this._simulation = value
    }
    
    async simulate(until = Number.MAX_VALUE, factor = Number.MAX_VALUE) {
        if (this.simulation) {
            throw "Simulation already running!"
        }

        const start = Date.now()

        console.debug("Simulation start")

        // Initialize model status
        this.dynamicComponents = []
        this.updates = new Map<Component<any, any>, number[]>()
        this.events = []
        this.time = 0
        this.progress = 0
        this.simulation = true
        
        // Reset all static components
        for (const component of this.staticComponents) {
            component.reset()
        }
        // Update all static components
        for (const component of this.staticComponents) {
            component.update()
        }

        // Execute loop
        if (factor == Number.MAX_VALUE) {
            this.loopSync(until)
        } else {
            await this.loopAsync(until, factor)
        }

        // Reset model status
        this.simulation = false

        console.debug("Simulation end")

        return Date.now() - start
    }

    private loopSync(until: number) {
        try {
            while (true) {
                this.step(until)
            }
        } catch {
            return
        }
    }

    private async loopAsync(until: number, factor: number) {
        const startReal = Date.now()
        const startSim = this.time
        return new Promise<void>((resolve, _reject) => {
            const next = () => {
                try {
                    const deltaReal = Date.now() - startReal
                    while (this.events.length > 0) {
                        const deltaSim = (this.events[0].time - startSim) / factor
                        if (deltaReal >= deltaSim) {
                            this.step(until)
                        } else {
                            setTimeout(next, Math.min(deltaSim - deltaReal, 1000 / 30))
                            return
                        }
                    }
                } catch {

                }
                resolve()
            }
            next()
        })
    }

    private step(until: number) {
        // Process events until no more events or time horizon reached
        if (this.events.length > 0) {
            // Take next event
            const event = this.events.shift()
            // Check if event is within time horizon
            if (event.time < until) {
                this.time = event.time
                this.progress = this.time / until

                console.debug('Time:', this.time)
                console.debug()
                event.component.update()
                console.debug()
            } else {
                this.time = until
                this.progress = 1

                console.debug('Time:', this.time)
                console.debug()

                throw 0
            }
        }
    }
    
}