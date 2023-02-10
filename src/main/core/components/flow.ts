import { Component } from "../component.js"

export abstract class FlowComponent<I, O> extends Component<I, O> {
    send(component: Component<any, any>) {
        Component.CONTEXT.push(this)
        this.recieve(component)
        Component.CONTEXT.pop()
    }

    protected abstract recieve(component: Component<any ,any>)
}