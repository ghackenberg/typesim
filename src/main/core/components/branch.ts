import { Component } from "../component.js"
import { FlowComponent } from "./flow.js"

interface BranchI {
    next: FlowComponent<any, any>[]
    choice: number
}
interface BranchO {
    object: Component<any, any>
    count: number
}

export class Branch extends FlowComponent<BranchI, BranchO> {
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
        this._outputs.count++

        const next = this.inputs.next
        const choice = this.inputs.choice

        next[choice].sendComponent(component)
    }
}