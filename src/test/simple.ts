import { Branch, Entity, Model, Queue, Server, Sink, Source } from '../main/index.js'

function simple() {
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

async function run() {
    console.debug = () => {}

    const model = new Model()
    const { source, queue, sink } = simple()

    console.log("Run 1")

    await model.simulate(10000)
    
    console.log("Source.count", source.outputs.count)
    console.log("Queue.length", queue.outputs.length)
    console.log("Sink.count", sink.outputs.count)

    console.log("Run 2")
    
    await model.simulate(10000, 2)
    
    console.log("Source.count", source.outputs.count)
    console.log("Queue.length", queue.outputs.length)
    console.log("Sink.count", sink.outputs.count)

    console.log("Run 3")
    
    await model.simulate(10000, 1)
    
    console.log("Source.count", source.outputs.count)
    console.log("Queue.length", queue.outputs.length)
    console.log("Sink.count", sink.outputs.count)
}

run()