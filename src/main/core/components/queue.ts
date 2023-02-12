import { BoxGeometry, Mesh, MeshBasicMaterial } from "three"
import { Component } from "../component.js"
import { FlowComponent } from "./flow.js"

interface QueueI { }
interface QueueO {
    objects: Component<any, any>[]
    length: number
}

export class Queue extends FlowComponent<QueueI, QueueO> {
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
            objects: [],
            length: 0
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
        this.outputs.objects.push(component)
        this.outputs.length += 1
    }

    // Queue

    public takeComponent() {
        Component.CONTEXT.push(this)
        this.outputs.length -= 1
        const object = this.outputs.objects.shift()
        Component.CONTEXT.pop()
        return object
    }
}