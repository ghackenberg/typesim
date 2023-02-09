import { Component } from "../component.js"
import { Event } from "../event.js"
import { Input, read } from "../input.js"
import { FlowComponent } from "./flow.js"

type SourceI = {
    prototype: Input<Component<any, any>>
    firstArrivalTime: Input<number>
    interArrivalTime: Input<number>
    count: Input<number>
    next: Input<FlowComponent<any, any>>
}
type SourceO = {
    count: number
}

export class Source extends Component<SourceI, SourceO> {
    override reset() {
        this.outputs = {
            name: read(this.inputs.name),
            count: 0
        }
        const time = this.model.now() + read(this.inputs.firstArrivalTime)
        this.model.schedule(new Event(time, () => this.process()))
    }
    override copy() {
        return new Source(this.model, this.inputs)
    }

    private process() {
        const prototype = read(this.inputs.prototype)
        const count = read(this.inputs.count)
        const next = read(this.inputs.next)

        console.log(this.outputs.name, "produces", count, "objects")

        for (let index = 0; index < count; index++) {
            next.send(prototype.clone())
        }

        this.outputs.count += count

        const time = this.model.now() + read(this.inputs.interArrivalTime)
        this.model.schedule(new Event(time, () => this.process()))
    }
}