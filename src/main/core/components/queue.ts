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
    override check() {
        return []
    }
    override reset() {
        this.outputs = {
            name: this.inputs.name,
            position: this.inputs.position,
            orientation: this.inputs.orientation,
            scale: this.inputs.scale,
            objects: [],
            length: 0
        }
        if (this.model.visualization) {
            this.geometry = new BoxGeometry()
            this.material = new MeshBasicMaterial()
            this.mesh = new Mesh(this.geometry, this.material)
            this.object = this.mesh
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