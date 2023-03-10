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

    public staticComponents: Component<any, any>[] = []
    public dynamicComponents: Component<any, any>[]

    private updates: Map<Component<any, any>, number[]>
    private events: Event[]
    private _time: number
    private _simulation: boolean = false
    private _visualization: boolean = false

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
    removeDynamicComponent(component: Component<any, any>) {
        this.dynamicComponents.splice(this.dynamicComponents.indexOf(component), 1)
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
        if (array.length == 0) {
            array.push(value)
        } else {
            const index = this.searchBinary(array, comparator, value)
            if (comparator(array[index], value) > 0) {
                array.splice(index, 0, value)
            } else {
                array.splice(index + 1, 0, value)
            }
        }
    }
    private removeBinary<T>(array: T[], comparator: (a: T, b: T) => number, value: T) {
        if (array.length > 0) {
            const index = this.searchBinary(array, comparator, value)
            if (array[index] == value) {
                array.splice(index, 1)
            }
        }
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

    get simulation() {
        return this._simulation
    }
    private set simulation(value: boolean) {
        this._simulation = value
    }

    get visualization() {
        return this._visualization
    }
    private set visualization(value: boolean) {
        this._visualization = value
    }
    
    async simulate(until = Number.MAX_VALUE, factor = Number.MAX_VALUE) {
        if (this.simulation) {
            throw "Simulation already running!"
        }

        // Check all components
        let issues: string[] = []
        for (const component of this.staticComponents) {
            issues = issues.concat(component.checkInputs())
        }
        if (issues.length > 0) {
            throw issues
        }

        const start = Date.now()

        console.debug("Simulation start")

        // Initialize model status
        this.dynamicComponents = []
        this.updates = new Map<Component<any, any>, number[]>()
        this.events = []
        this.time = 0
        this.simulation = true
        
        // Reset all static components
        console.debug("Simulation reset")
        for (const component of this.staticComponents) {
            component.reset()
        }

        // Execute loop
        console.debug("Simulation loop")
        if (factor == Number.MAX_VALUE) {
            this.loopSync(until)
        } else {
            await this.loopAsync(until, factor)
        }

        // Reset model status
        this.simulation = false

        console.debug("Simulation end")

        const end = Date.now()

        console.log(end - start, "ms")
    }

    private loopSync(until: number) {
        while (this.events.length > 0) {
            if (this.events[0].time <= until) {
                this.step()
            } else {
                break
            }
        }
        if (this.time != until) {
            // Update clock
            this.time = until
                        
            console.debug('Time:', this.time)
            console.debug()
        }
    }

    private async loopAsync(until: number, factor: number) {
        const startReal = Date.now()
        const startSim = this.time
        return new Promise<void>((resolve, reject) => {
            const next = () => {
                try {
                    const nowReal = Date.now()
                    const deltaReal = nowReal - startReal
                    while (this.events.length > 0) {
                        const nowSim = this.events[0].time
                        if (nowSim <= until) {
                            const deltaSim = (nowSim - startSim) / factor
                            if (deltaReal >= deltaSim) {
                                this.step()
                            } else {
                                this.time = deltaReal * factor + startSim
                                setTimeout(next, Math.min(deltaSim - deltaReal, 1000 / 30))
                                return
                            }
                        } else {
                            break
                        }
                    }
                    if (this.time != until) {
                        // Update clock
                        this.time = until
                        
                        console.debug('Time:', this.time)
                        console.debug()
                    }
                    resolve()
                } catch(error) {
                    reject(error)
                }
            }
            next()
        })
    }

    private step() {
        // Take next event
        const event = this.events.shift()
        // Remove update
        this.removeBinary(this.updates.get(event.component), (a, b) => a - b, event.time)
        
        // Update clock
        this.time = event.time

        console.debug('Time:', this.time)
        console.debug()

        // Update component
        event.component.update()
        console.debug()
    }
    
}