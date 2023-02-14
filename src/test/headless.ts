import { Model } from '../main/index.js'
import { simple } from './simple.js'

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