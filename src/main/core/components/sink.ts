import { Component } from "../component.js"
import { FlowComponent } from "./flow.js"

interface SinkI { }
interface SinkO {
    object: Component<any, any>
    count: number
}

export class Sink extends FlowComponent<SinkI, SinkO> {
    override check() {
        return []
    }
    override reset() {
        this.outputs = {
            name: this.inputs.name,
            object: null,
            count: 0
        }
    }

    protected override recieve(component: Component<any, any>) {
        this.outputs.object = component
        this.outputs.count += 1
    }
}