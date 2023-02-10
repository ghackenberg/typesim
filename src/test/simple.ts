import { Branch, Entity, Model, Queue, Server, Sink, Source } from '../main/index.js'

async function run() {
    console.debug = () => {}

    const model = new Model()
    
    const source = new Source(model)
    const queue = new Queue(model)
    const server = new Server(model)
    const branch = new Branch(model)
    const sink = new Sink(model)
    
    source.inputs = {
        name: "Source",
        factory: () => new Entity(model, {
            name: `Entity_${source.outputs.count}`
        }),
        get count() { return Math.random() * 10 },
        firstArrivalTime: 0,
        get interArrivalTime() { return Math.random() * 20 },
        next: queue
    }
    queue.inputs = {
        name: "Queue"
    }
    server.inputs = {
        name: "Server",
        queue: queue,
        get serviceTime () { return Math.random() * 30 },
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

    console.log("Run 1")

    console.log(await model.simulate(1000), "ms")
    
    console.log("Source.count", source.outputs.count)
    console.log("Queue.length", queue.outputs.length)
    console.log("Sink.count", sink.outputs.count)

    console.log("Run 2")
    
    console.log(await model.simulate(1000, 1), "ms")
    
    console.log("Source.count", source.outputs.count)
    console.log("Queue.length", queue.outputs.length)
    console.log("Sink.count", sink.outputs.count)

    console.log("Run 3")
    
    console.log(await model.simulate(1000, 0.5), "ms")
    
    console.log("Source.count", source.outputs.count)
    console.log("Queue.length", queue.outputs.length)
    console.log("Sink.count", sink.outputs.count)
}

run()