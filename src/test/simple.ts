import { Branch, Entity, Model, Queue, Server, Sink, Source, Vector } from '../main/index.js'

async function run() {
    console.debug = () => {}

    const model = new Model()
    
    const source = new Source()
    const queue = new Queue()
    const server = new Server()
    const branch = new Branch()
    const sink = new Sink()
    
    source.inputs = {
        name: "Source",
        position: new Vector(0, 0, 0),
        orientation: new Vector(0, 0, 0),
        scale: new Vector(1, 1, 1),
        factory() {
            return new Entity(model, {
                name: `Entity_${source.outputs.count}`,
                position: new Vector(0, 0, 0),
                orientation: new Vector(0, 0, 0),
                scale: new Vector(1, 1, 1)
            })
        },
        get count() {
            return Math.random() * 10
        },
        firstArrivalTime: 0,
        get interArrivalTime() {
            return Math.random() * 20
        },
        next: queue
    }
    queue.inputs = {
        name: "Queue",
        position: new Vector(0, 0, 0),
        orientation: new Vector(0, 0, 0),
        scale: new Vector(1, 1, 1)
    }
    server.inputs = {
        name: "Server",
        position: new Vector(0, 0, 0),
        orientation: new Vector(0, 0, 0),
        scale: new Vector(1, 1, 1),
        queue: queue,
        get serviceTime() {
            return Math.random() * 30
        },
        next: branch
    }
    branch.inputs = {
        name: "Branch",
        position: new Vector(0, 0, 0),
        orientation: new Vector(0, 0, 0),
        scale: new Vector(1, 1, 1),
        next: [sink],
        choice: 0
    }
    sink.inputs = {
        name: "Sink",
        position: new Vector(0, 0, 0),
        orientation: new Vector(0, 0, 0),
        scale: new Vector(1, 1, 1)
    }

    console.log("Run 1")

    console.log(await model.simulate(10000), "ms")
    
    console.log("Source.count", source.outputs.count)
    console.log("Queue.length", queue.outputs.length)
    console.log("Sink.count", sink.outputs.count)

    console.log("Run 2")
    
    console.log(await model.simulate(10000, 2), "ms")
    
    console.log("Source.count", source.outputs.count)
    console.log("Queue.length", queue.outputs.length)
    console.log("Sink.count", sink.outputs.count)

    console.log("Run 3")
    
    console.log(await model.simulate(10000, 1), "ms")
    
    console.log("Source.count", source.outputs.count)
    console.log("Queue.length", queue.outputs.length)
    console.log("Sink.count", sink.outputs.count)
}

run()