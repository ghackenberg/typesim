import { BoxGeometry, Mesh, MeshBasicMaterial } from "three"
import { Component } from "../component.js"
import { FlowComponent } from "./flow.js"
import { Queue } from "./queue.js"

interface ServerI {
    queue: Queue
    serviceTime?: number
    next: FlowComponent<any, any>
}
interface ServerO {
    object: Component<any, any>
    departureTime: number
    count: number
}

export class Server extends Component<ServerI, ServerO> {
    private geometry: BoxGeometry
    private material: MeshBasicMaterial
    private mesh: Mesh

    // Component

    protected override get defaults() {
        return {
            ...super.defaults,
            serviceTime: 1000
        }
    }
    protected override initOutputs() {
        return {
            name: this.inputs.name,
            position: this.inputs.position,
            orientation: this.inputs.orientation,
            scale: this.inputs.scale,
            object: null,
            departureTime: 0,
            count: 0
        }
    }
    protected override initUpdates() {
        return [
            this.model.time
        ]
    }
    protected override initVisualization() {
        this.geometry = new BoxGeometry()
        this.material = new MeshBasicMaterial()
        this.mesh = new Mesh(this.geometry, this.material)
        return this.mesh
    }
    protected override processUpdate() {
        if (this.outputs.object != null && this.outputs.departureTime == this.model.time) {
            const next = this.inputs.next

            next.sendComponent(this.outputs.object)

            this.outputs.object = null
        }
        if (this.outputs.object == null) {
            const queue = this.inputs.queue
    
            if (queue.outputs.length > 0) {
                const time = this.model.time + this.inputs.serviceTime

                this.outputs.object = queue.takeComponent()
                this.outputs.departureTime = time
                this.outputs.count += 1
    
                this.model.scheduleUpdate(time, this)
            }
        }
    }
}