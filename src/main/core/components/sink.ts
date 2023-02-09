import { Component } from "../component.js"
import { read } from "../input.js"
import { FlowComponent } from "./flow.js"

type SinkI = { }
type SinkO = {
    object: Component<any, any>
    count: number
}

export class Sink extends FlowComponent<SinkI, SinkO> {
    override reset() {
        this.outputs = {
            name: read(this.inputs.name),
            object: null,
            count: 0
        }
    }
    override copy() {
        return new Sink(this.model, this.inputs)
    }

    override send(component: Component<any, any>) {
        this.outputs.object = component
        this.outputs.count += 1

        console.log(this.outputs.name, "consumes 1 object")
    }
}