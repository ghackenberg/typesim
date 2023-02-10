import { Component } from "../component.js"
import { FlowComponent } from "./flow.js"

interface SourceI {
    get factory(): (count: number) => Component<any, any>
    get firstArrivalTime(): number
    get interArrivalTime(): number
    get count(): number
    get next(): FlowComponent<any, any>
}
interface SourceO {
    object: Component<any, any>
    count: number
}

export class Source extends Component<SourceI, SourceO> {
    override reset() {
        this.outputs = {
            name: this.inputs.name,
            object: null,
            count: 0
        }
        const time = this.model.time + this.inputs.firstArrivalTime
        this.model.scheduleUpdate(time, this)
    }
    protected override process() {
        const factory = this.inputs.factory
        const count = this.inputs.count
        const next = this.inputs.next

        for (let index = 0; index < count; index++) {
            const object = factory(this.outputs.count + index)
            
            object.reset()
            object.update()
            
            this.outputs.object = object
            this.outputs.count++

            next.send(object)
        }

        const time = this.model.time + this.inputs.interArrivalTime
        this.model.scheduleUpdate(time, this)
    }
}