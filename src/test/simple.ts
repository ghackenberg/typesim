import { Entity, Model, Queue, Server, Sink, Source } from '../main/index.js'

const model = new Model()

const queue = new Queue(model, {
    name: "Queue"
})
const source = new Source(model, {
    name: "Source",
    factory: count => new Entity(model, {
        name: `Entity_${count}`
    }),
    count: Math.random() * 10,
    firstArrivalTime: 0,
    interArrivalTime: Math.random() * 20,
    next: queue
})
const sink = new Sink(model, {
    name: "Sink"
})
const server = new Server(model, {
    name: "Server",
    queue: queue,
    serviceTime: Math.random() * 30,
    next: sink
})

model.simulate(1000)