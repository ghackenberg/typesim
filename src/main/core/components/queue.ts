import { Component } from "../component.js"
import { read } from "../input.js"
import { FlowComponent } from "./flow.js"

type QueueI = { }
type QueueO = {
    objects: Component<any, any>[]
}

export class Queue extends FlowComponent<QueueI, QueueO> {
    override reset() {
        this.outputs = {
            name: read(this.inputs.name),
            objects: []
        }
    }
    override copy() {
        return new Queue(this.model, this.inputs)
    }
    override update() {
        super.update()
    }

    override flow(component: Component<any, any>) {
        console.log(this.outputs.name, "consumes 1 object")
        this.outputs.objects.push(component)
    }

    public take() {
        return this.outputs.objects.shift()
    }
}