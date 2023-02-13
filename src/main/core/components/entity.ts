import { Component } from "../component.js"

interface EntityI { }
interface EntityO { }

export class Entity extends Component<EntityI, EntityO> {
    // Component

    protected override initOutputs() {
        return {
            name: this.inputs.name,
            position: this.inputs.position,
            orientation: this.inputs.orientation,
            scale: this.inputs.scale,
            display: this.inputs.display
        }
    }
}