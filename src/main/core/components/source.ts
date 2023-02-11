import { BoxGeometry, Mesh, MeshBasicMaterial } from "three"
import { Component } from "../component.js"
import { FlowComponent } from "./flow.js"

interface SourceI {
    get factory(): () => Component<any, any>
    get firstArrivalTime(): number
    get interArrivalTime(): number
    get count(): number
    get next(): FlowComponent<any, any>
}
interface SourceO {
    object: Component<any, any>
    count: number
}

export class Source extends Component<SourceI, SourceO> {
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
            object: null,
            count: 0
        }
        const time = this.model.time + this.inputs.firstArrivalTime
        this.model.scheduleUpdate(time, this)
        if (this.model.visualization) {
            this.geometry = new BoxGeometry()
            this.material = new MeshBasicMaterial()
            this.mesh = new Mesh(this.geometry, this.material)
            this.object = this.mesh
        }
    }
    protected override process() {
        const factory = this.inputs.factory
        const count = this.inputs.count
        const next = this.inputs.next

        for (let index = 0; index < count; index++) {
            const object = factory()
            
            object.check()
            object.reset()
            object.update()
            
            this.outputs.object = object
            this.outputs.count++

            next.send(object)
        }

        const time = this.model.time + this.inputs.interArrivalTime
        this.model.scheduleUpdate(time, this)
    }
}