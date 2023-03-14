import { Box, Branch, Entity, Queue, Server, Sink, Source } from "../main/index"

export function simple() {
    const source = new Source()
    const queue1 = new Queue()
    const server = new Server()
    const branch = new Branch()
    const queue2 = new Queue()
    const sink = new Sink()
    
    source.inputs = {
        name: "Source",
        position: [-20, 0, 0],
        factory() {
            return new Entity({
                name: `Entity_${source.outputs.count}`,
                display: Box(1.5, 1.5, 1.5, "red")
            })
        },
        get count() {
            return 1
        },
        get interArrivalTime() {
            return Math.random() * 1000
        },
        next: queue1
    }
    queue1.inputs = {
        name: "Queue 1",
        position: [-10, 0, 0]
    }
    server.inputs = {
        name: "Server",
        position: [0, 0, 0],
        queue: queue1,
        get serviceTime() {
            return Math.random() * 3000
        },
        next: branch
    }
    branch.inputs = {
        name: "Branch",
        position: [10, 0, 0],
        next: [queue2, sink],
        choice: 0
    }
    queue2.inputs = {
        name: "Queue 2",
        position: [20, 0, 10],
    }
    sink.inputs = {
        name: "Sink",
        position: [20, 0, -10]
    }

    return { source, queue: queue1, server, branch, sink }
}