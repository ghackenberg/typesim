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
        this.outputs.count++

        const next = this.inputs.next
        const choice = this.inputs.choice

        next[choice].send(component)
    }
}