import { BoxGeometry, Mesh, MeshBasicMaterial } from "three"
import { Component } from "../component.js"

interface EntityI { }
interface EntityO { }

export class Entity extends Component<EntityI, EntityO> {
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
            scale: this.inputs.scale
        }
        if (this.model.visualization) {
            this.geometry = new BoxGeometry()
            this.material = new MeshBasicMaterial()
            this.mesh = new Mesh(this.geometry, this.material)
            this.object = this.mesh
        }
    }
}