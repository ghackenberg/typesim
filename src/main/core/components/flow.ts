import { Component } from "../component.js"

export abstract class FlowComponent<I, O> extends Component<I, O> {
    // FlowComponent

    send(component: Component<any, any>) {
        Component.CONTEXT.push(this)
        component.move(this.outputs.position.x, this.outputs.position.y, this.outputs.position.z)
        this.recieve(component)
        Component.CONTEXT.pop()
    }

    protected abstract recieve(component: Component<any ,any>)
}