import { Object3D } from "three"
import { Model } from "./model.js"
import { Vector } from "./vector.js"

interface ComponentI {
    get name(): string
    get position(): Vector
    get orientation(): Vector
    get scale(): Vector
}
interface ComponentO {
    name: string
    position: Vector
    orientation: Vector
    scale: Vector
}

export enum ComponentType {
    STATIC, DYNAMIC
}
export abstract class Component<I, O> {

    protected static CONTEXT: Component<any, any>[] = []

    private _type: ComponentType
    private _model: Model
    private _inputs: I & ComponentI
    private _outputs: O & ComponentO

    private tracking = new Map<Component<any, any>, string[]>()
    private trackedBy = new Map<string, Component<any, any>[]>()

    private visualization: Object3D
    
    constructor(model: Model = Model.INSTANCE, inputs: I & ComponentI = undefined) {
        this.model = model
        this.inputs = inputs
        if (model.simulation) {
            this.type = ComponentType.DYNAMIC
            model.addDynamicComponent(this)
        } else {
            this.type = ComponentType.STATIC
            model.addStaticComponent(this)
        }
    }

    get type() {
        return this._type
    }
    private set type(value: ComponentType) {
        this._type = value
    }

    get model() {
        return this._model
    }
    private set model(value: Model) {
        this._model = value
    }

    get inputs() {
        return this._inputs
    }
    set inputs(value: I & ComponentI) {
        if (this._inputs) {
            throw "Cannot set inputs twice!"
        }
        this._inputs = value
    }

    get outputs() {
        return this._outputs
    }
    protected set outputs(value: O & ComponentO) {
        const copy = { ...value }
        for (const p in copy) {
            Object.defineProperty(copy, p, {
                get: () => {
                    if (Component.CONTEXT.length > 0) {
                        const context = Component.CONTEXT[Component.CONTEXT.length - 1]
                        if (context != this) {
                            if (!context.tracking.has(this)) {
                                context.tracking.set(this, [])
                            }
                            if (!this.trackedBy.has(p)) {
                                this.trackedBy.set(p, [])
                            }
                            if (context.tracking.get(this).indexOf(p) == -1) {
                                console.debug(Component.CONTEXT.map(comp => comp.inputs.name), `tracks ${this.inputs.name}.${p}`)
                                context.tracking.get(this).push(p)
                            }
                            if (this.trackedBy.get(p).indexOf(context) == -1) {
                                this.trackedBy.get(p).push(context)
                            }
                        }
                    }
                    return value[p]
                },
                set: temp => {
                    if (Component.CONTEXT.length > 0) {
                        const context = Component.CONTEXT[Component.CONTEXT.length - 1]
                        console.debug(Component.CONTEXT.map(comp => comp.inputs.name), `updates ${this.inputs.name}.${p}=${temp}`)
                        if (context != this) {
                            throw "Component outputs must not be writted from other components! Context tracking might not be correct..."
                        }
                        if (this.trackedBy.has(p)) {
                            for (const comp of this.trackedBy.get(p)) {
                                if (comp != this && Component.CONTEXT.indexOf(comp) == -1) {
                                    console.debug(`... causes ${comp.inputs.name} update`)
                                    this.model.scheduleUpdate(this.model.time, comp)
                                }
                            }
                        }
                    }
                    value[p] = temp
                }
            })
        }
        this._outputs = copy
    }

    checkInputs(): string[] {
        return []
    }
    
    reset() {
        this.outputs = this.initOutputs()
        for (const time of this.initUpdates()) {
            this.model.scheduleUpdate(time, this)
        }
        if (this.model.visualization) {
            this.visualization = this.initVisualization()
            if (this.visualization) {
                this.model.scene.add(this.visualization)
            }
        }
    }

    protected abstract initOutputs(): ComponentO & O

    protected initUpdates(): number[] {
        return []
    }
    protected initVisualization(): Object3D {
        return null
    }

    update() {
        // Update tracking state
        if (Component.CONTEXT.indexOf(this) == -1) {
            for (const [comp, props] of this.tracking)  {
                for (const prop of props) {
                    comp.trackedBy.get(prop).splice(comp.trackedBy.get(prop).indexOf(this), 1)
                }
            }
            this.tracking.clear()
        }
        // Perform update
        Component.CONTEXT.push(this)
        console.debug(Component.CONTEXT.map(comp => comp.inputs.name), "update start")
        this.process()
        console.debug(Component.CONTEXT.map(comp => comp.inputs.name), "update end")
        Component.CONTEXT.pop()
    }

    protected process() {

    }

    move(x: number, y: number, z: number) {
        Component.CONTEXT.push(this)
        this.outputs.position = new Vector(x, y, z)
        if (this.visualization) {
            this.visualization.position.x = x
            this.visualization.position.y = y
            this.visualization.position.z = z
        }
        Component.CONTEXT.pop()
    }
    
}