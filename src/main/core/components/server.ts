import { Component } from "../component.js"
import { FlowComponent } from "./flow.js"
import { Queue } from "./queue.js"

interface ServerI {
    queue: Queue
    serviceTime?: number
    next: FlowComponent<any, any>
}
interface ServerO {
    object: Component<any, any>
    departureTime: number
    count: number
}

export class Server extends Component<ServerI, ServerO> {
    // Component

    protected override get defaults() {
        return {
            ...super.defaults,
            serviceTime: 1000
        }
    }
    protected override initOutputs() {
        return {
            name: this.inputs.name,
            position: this.inputs.position,
            orientation: this.inputs.orientation,
            scale: this.inputs.scale,
            display: this.inputs.display,
            object: null,
            departureTime: 0,
            count: 0
        }
    }
    protected override initUpdates() {
        return [
            this.model.time
        ]
    }
    protected override processUpdate() {
        if (this.outputs.object != null && this.outputs.departureTime == this.model.time) {
            const next = this.inputs.next

            next.sendComponent(this.outputs.object)

            this._outputs.object = null
        }
        if (this.outputs.object == null) {
            const queue = this.inputs.queue
    
            if (queue.outputs.length > 0) {
                const time = this.model.time + this.inputs.serviceTime
                const object = queue.takeComponent()

                this._outputs.object = object
                this._outputs.departureTime = time
                this._outputs.count += 1

                object.move(this.outputs.position)
    
                this.model.scheduleUpdate(time, this)
            }
        }
    }
}