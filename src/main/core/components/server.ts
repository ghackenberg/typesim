import { Component } from "../component.js"
import { FlowComponent } from "./flow.js"
import { Queue } from "./queue.js"

interface ServerI {
    get queue(): Queue
    get serviceTime(): number
    get next(): FlowComponent<any, any>
}
interface ServerO {
    object: Component<any, any>
    departureTime: number
    count: number
}

export class Server extends Component<ServerI, ServerO> {
    override check() {
        return []
    }
    override reset() {
        this.outputs = {
            name: this.inputs.name,
            object: null,
            departureTime: 0,
            count: 0
        }
    }
    protected override process() {
        if (this.outputs.object != null && this.outputs.departureTime == this.model.time) {
            const next = this.inputs.next

            next.send(this.outputs.object)

            this.outputs.object = null
        }
        if (this.outputs.object == null) {
            const queue = this.inputs.queue
    
            if (queue.outputs.length > 0) {
                const time = this.model.time + this.inputs.serviceTime

                this.outputs.object = queue.take()
                this.outputs.departureTime = time
                this.outputs.count += 1
    
                this.model.scheduleUpdate(time, this)
            }
        }
    }
}