import { Component } from "../component.js"
import { read } from "../input.js"
import { FlowComponent } from "./flow.js"

type QueueI = { }
type QueueO = {
    objects: Component<any, any>[],
    length: number
}

export class Queue extends FlowComponent<QueueI, QueueO> {
    override reset() {
        this.outputs = {
            name: read(this.inputs.name),
            objects: [],
            length: 0
        }
    }
    override copy() {
        return new Queue(this.model, this.inputs)
    }

    override send(component: Component<any, any>) {
        console.log(this.outputs.name, "consumes 1 object")

        this.outputs.objects.push(component)
        this.outputs.length += 1
    }

    public take() {
        this.outputs.length -= 1
        return this.outputs.objects.shift()
    }
}