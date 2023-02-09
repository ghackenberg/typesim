import { Component } from "../component.js"
import { Event } from "../event.js"
import { Input, read } from "../input.js"
import { FlowComponent } from "./flow.js"
import { Queue } from "./queue.js"

type ServerI = {
    queue: Input<Queue>
    serviceTime: Input<number>
    next: Input<FlowComponent<any, any>>
}
type ServerO = {
    object: Component<any, any>
    count: number
}

export class Server extends Component<ServerI, ServerO> {
    override reset() {
        this.outputs = {
            name: read(this.inputs.name),
            object: null,
            count: 0
        }
    }
    override copy() {
        return new Server(this.model, this.inputs)
    }
    override update() {
        super.update()

        if (this.outputs.object == null) {
            const queue = read(this.inputs.queue)

            if (queue.outputs.length > 0) {
                console.log(this.outputs.name, "consumes 1 object")

                const next = read(this.inputs.next)

                this.outputs.object = queue.take()
                this.outputs.count += 1
        
                const time = this.model.now() + read(this.inputs.serviceTime)

                this.model.schedule(new Event(time, () => {
                    next.send(this.outputs.object)

                    this.outputs.object = null
                    this.update()
                }))
            }
        }
    }
}