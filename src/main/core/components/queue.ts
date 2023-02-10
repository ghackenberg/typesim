import { Component } from "../component.js"
import { FlowComponent } from "./flow.js"

interface QueueI { }
interface QueueO {
    objects: Component<any, any>[]
    length: number
}

export class Queue extends FlowComponent<QueueI, QueueO> {
    override reset() {
        this.outputs = {
            name: this.inputs.name,
            objects: [],
            length: 0
        }
    }

    protected override recieve(component: Component<any, any>) {
        this.outputs.objects.push(component)
        this.outputs.length += 1
    }

    public take() {
        Component.CONTEXT.push(this)
        this.outputs.length -= 1
        const object = this.outputs.objects.shift()
        Component.CONTEXT.pop()
        return object
    }
}