import { Component } from "./component"

export class Event {
    private _time: number
    private _component: Component<any, any>

    constructor(time: number, component: Component<any, any>) {
        this.time = time
        this.component = component
    }

    get time() {
        return this._time
    }
    private set time(value: number) {
        this._time = value
    }

    get component() {
        return this._component
    }
    private set component(value: Component<any, any>) {
        this._component = value
    }
}