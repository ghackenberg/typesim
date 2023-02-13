import { Display } from "../display.js"
import { Vector } from "../vector.js"

export class Primitive extends Display {
    constructor(position: Vector, orientation: Vector, scale: Vector, public color: string) {
        super(position, orientation, scale)
    }
}