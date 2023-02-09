import { Component } from "../component.js"
import { read } from "../input.js"

type EntityI = { }
type EntityO = { }

export class Entity extends Component<EntityI, EntityO> {
    override reset() {
        this.outputs = {
            name: read(this.inputs.name)
        }
    }
    override copy() {
        return new Entity(this.model, this.inputs)
    }
    override update() {
        super.update()
    }
}