import { Component } from "../component.js"
import { FlowComponent } from "./flow.js"

interface QueueI { }
interface QueueO {
    objects: Component<any, any>[]
    length: number
}

export class Queue extends FlowComponent<QueueI, QueueO> {
    // Component

    protected override initOutputs() {
        return {
            name: this.inputs.name,
            position: this.inputs.position,
            orientation: this.inputs.orientation,
            scale: this.inputs.scale,
            display: this.inputs.display,
            objects: [],
            length: 0
        }
    }

    // FlowComponent

    protected override recieveComponent(component: Component<any, any>) {
        this._outputs.objects.push(component)
        this._outputs.length += 1

        const [x, y, z] = this.outputs.position

        component.move([x, y + 2 * this.outputs.length, z])
    }

    // Queue

    public takeComponent() {
        Component.CONTEXT.push(this)
        this._outputs.length -= 1
        const object = this.outputs.objects.shift()
        const [x, y, z] = this.outputs.position
        let index = 1
        for (const component of this.outputs.objects) {
            component.move([x, y + index++ * 2, z])
        }
        Component.CONTEXT.pop()
        return object
    }
}