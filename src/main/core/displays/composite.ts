import { Display } from "../display.js"
import { Vector } from "../vector.js"

export class CompositeImpl extends Display {
    constructor(position: Vector, orientation: Vector, scale: Vector, public children: Display[]) {
        super(position, orientation, scale)
    }
}
export function Composite(children: Display[], position: Vector = [0, 0, 0], orientation: Vector = [0, 0, 0], scale: Vector = [1, 1, 1]) {
    return new CompositeImpl(position, orientation, scale, children)
}