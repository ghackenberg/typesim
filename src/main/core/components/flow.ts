import { Component } from "../component.js"

export abstract class FlowComponent<I, O> extends Component<I, O> {
    
    // FlowComponent

    sendComponent(component: Component<any, any>) {
        Component.CONTEXT.push(this)
        component.move(this.outputs.position)
        this.recieveComponent(component)
        Component.CONTEXT.pop()
    }

    protected abstract recieveComponent(component: Component<any ,any>)
    
}