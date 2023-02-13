import { Component } from "../component.js"
import { FlowComponent } from "./flow.js"

interface SourceI {
    factory: () => Component<any, any>
    firstArrivalTime?: number
    interArrivalTime?: number
    count?: number
    next: FlowComponent<any, any>
}
interface SourceO {
    arrivalTime: number,
    object: Component<any, any>
    count: number
}

export class Source extends Component<SourceI, SourceO> {
    // Component

    protected override get defaults() {
        return {
            ...super.defaults,
            firstArrivalTime: 0,
            interArrivalTime: 1000,
            count: 0
        }
    }
    protected override initOutputs() {
        const time = this.model.time + this.inputs.firstArrivalTime
        return {
            name: this.inputs.name,
            position: this.inputs.position,
            orientation: this.inputs.orientation,
            scale: this.inputs.scale,
            display: this.inputs.display,
            arrivalTime: time,
            object: null,
            count: 0
        }
    }
    protected override initUpdates() {
        return [
            this.outputs.arrivalTime
        ]
    }
    protected override processUpdate() {
        if (this.model.time == this.outputs.arrivalTime) {
            const factory = this.inputs.factory
            const count = this.inputs.count
            const next = this.inputs.next
    
            for (let index = 0; index < count; index++) {
                const object = factory()
                
                const issues = object.checkInputs()
                if (issues.length > 0) {
                    throw issues
                }
    
                object.reset()
                object.update()
                
                this._outputs.object = object
                this._outputs.count++
    
                next.sendComponent(object)
            }
    
            const time = this.model.time + this.inputs.interArrivalTime

            this._outputs.arrivalTime = time

            this.model.scheduleUpdate(time, this)
        }
    }
}