import { Component } from "./component.js"
import { Event } from "./event.js"

export class Model {
    private components: Component<any, any>[] = []

    add(component: Component<any, any>) {
        this.components.push(component)
    }

    private copies: Component<any, any>[]
    private events: Event[]
    private time: number
    private progress: number

    track(copy: Component<any, any>) {
        this.copies.push(copy)
    }

    schedule(event: Event) {
        this.events.push(event)
    }

    now() {
        return this.time
    }
    
    simulate(until = Number.MAX_VALUE) {
        console.debug("Simulation start")

        this.copies = []
        this.events = []
        this.time = 0
        this.progress = 0
        
        for (const component of this.components) {
            component.reset()
        }

        while (this.events.length > 0) {
            this.events.sort((a, b) => a.time - b.time)
            const event = this.events.shift()
            if (event.time < until) {
                this.time = event.time
                this.progress = this.time / until

                console.debug('Time:', this.time)

                event.process()

                for (const component of this.components) {
                    component.update()
                }
                for (const copy of this.copies) {
                    copy.update()
                }
            } else {
                this.time = until
                this.progress = 1

                console.debug('Time:', this.time)

                break
            }
        }

        if (this.time < until) {
            this.time = until
            this.progress = 1

            console.debug('Time:', this.time)
        }

        console.debug("Simulation end")
    }
}