import { BoxGeometry, Mesh, MeshBasicMaterial } from "three"
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
    private geometry: BoxGeometry
    private material: MeshBasicMaterial
    private mesh: Mesh

    // Component

    protected override initOutputs() {
        return {
            name: this.inputs.name,
            position: this.inputs.position,
            orientation: this.inputs.orientation,
            scale: this.inputs.scale,
            object: null,
            count: 0
        }
    }
    protected override initVisualization() {
        this.geometry = new BoxGeometry()
        this.material = new MeshBasicMaterial()
        this.mesh = new Mesh(this.geometry, this.material)
        return this.mesh
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