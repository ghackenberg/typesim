import { Component } from "../component.js"
import { FlowComponent } from "./flow.js"

interface SinkI { }
interface SinkO {
    object: Component<any, any>
    count: number
}

export class Sink extends FlowComponent<SinkI, SinkO> {
    // Component

    protected override initOutputs() {
        return {
            name: this.inputs.name,
            position: this.inputs.position,
            orientation: this.inputs.orientation,
            scale: this.inputs.scale,
            display: this.inputs.display,
            object: null,
            count: 0
        }
    }

    // FlowComponent

    protected override recieveComponent(component: Component<any, any>) {
        this._outputs.object = component
        this._outputs.count += 1
    }
}