import { Component } from "../component.js"

export abstract class FlowComponent<I, O> extends Component<I, O> {
    abstract send(component: Component<any, any>)
}