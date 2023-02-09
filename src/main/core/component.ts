import { Input, read } from "./input.js"
import { Model } from "./model.js"

type ComponentI = {
    name: Input<string>
}
type ComponentO = {
    name: string
}

export abstract class Component<I, O> {    
    inputs: I & ComponentI
    outputs: O & ComponentO
    
    constructor(public model: Model, inputs: I & ComponentI) {
        this.model.add(this)
        this.inputs = inputs
    }

    clone() {
        const copy = this.copy()
        this.model.track(copy)
        copy.reset()
        return copy
    }

    protected abstract copy(): Component<I, O>
    
    abstract reset()

    update() {
        this.outputs.name = read(this.inputs.name)
    }
}