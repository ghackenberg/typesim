import { Component } from "./component.js"
import { Event } from "./event.js"

export class Model {

    private staticComponents: Component<any, any>[] = []
    private dynamicComponents: Component<any, any>[]
    private events: Event[]
    private _time: number
    private _progress: number
    private _simulation: boolean = false

    addStaticComponent(component: Component<any, any>) {
        this.staticComponents.push(component)
    }
    addDynamicComponent(component: Component<any, any>) {
        this.dynamicComponents.push(component)
    }

    scheduleUpdate(time: number, component: Component<any, any>) {
        for (const event of this.events) {
            if (event.time == time && event.component == component) {
                return
            }
        }
        this.events.push(new Event(time, component))
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
    
    simulate(until = Number.MAX_VALUE) {
        if (this.simulation) {
            throw "Simulation already running!"
        }

        console.debug("Simulation start")

        // Initialize model status
        this.dynamicComponents = []
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

        // Process events until no more events or time horizon reached
        while (this.events.length > 0) {
            // Sort events by time
            this.events.sort((a, b) => a.time - b.time)
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
                break
            }
        }

        // Check if simultion ended before time horizon
        if (this.time < until) {
            this.time = until
            this.progress = 1

            console.debug('Time:', this.time)
            console.debug()
        }

        // Reset model status
        this.simulation = false

        console.debug("Simulation end")
    }
    
}