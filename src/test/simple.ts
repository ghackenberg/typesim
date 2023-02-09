import { Entity, Model, Queue, Server, Sink, Source } from '../main/index.js'

const model = new Model()

const entity = new Entity(model, { name: "Entity" })
const queue = new Queue(model, { name: "Queue" })
const source = new Source(model, { name: "Source", prototype: entity, count: 1, firstArrivalTime: 0, interArrivalTime: 10, next: queue })
const sink = new Sink(model, { name: "Sink" })
const server = new Server(model, { name: "Server", queue, serviceTime: 15, next: sink })

model.simulate(1000)