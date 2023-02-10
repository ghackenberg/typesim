import { Branch, Entity, Model, Queue, Server, Sink, Source } from '../main/index.js'

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
    count: Math.random() * 10,
    firstArrivalTime: 0,
    interArrivalTime: Math.random() * 20,
    next: queue
}
queue.inputs = {
    name: "Queue"
}
server.inputs = {
    name: "Server",
    queue: queue,
    serviceTime: Math.random() * 30,
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

model.simulate(1000)

model.simulate(1000, 0.05)