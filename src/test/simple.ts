import { Branch, Entity, Queue, Server, Sink, Source } from "../main/index"

export function simple() {
    const source = new Source()
    const queue = new Queue()
    const server = new Server()
    const branch = new Branch()
    const sink = new Sink()
    
    source.inputs = {
        name: "Source",
        factory() {
            return new Entity({
                name: `Entity_${source.outputs.count}`
            })
        },
        get count() {
            return Math.random() * 10
        },
        get interArrivalTime() {
            return Math.random() * 2000
        },
        next: queue
    }
    queue.inputs = {
        name: "Queue"
    }
    server.inputs = {
        name: "Server",
        queue: queue,
        get serviceTime() {
            return Math.random() * 3000
        },
        next: branch
    }
    branch.inputs = {
        name: "Branch",
        next: [sink],
        choice: 0
    }
    sink.inputs = {
        name: "Sink"
    }

    return { source, queue, server, branch, sink }
}