import { Component } from "../component.js"

interface EntityI { }
interface EntityO { }

export class Entity extends Component<EntityI, EntityO> {
    override check() {
        return []
    }
    override reset() {
        this.outputs = {
            name: this.inputs.name
        }
    }
}