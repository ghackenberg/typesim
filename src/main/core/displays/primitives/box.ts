import { Vector } from "../../vector.js"
import { Primitive } from "../primitive.js"

export class BoxImpl extends Primitive {
    constructor(position: Vector, orientation: Vector, scale: Vector, color: string, public width: number, public height: number, public length: number) {
        super(position, orientation, scale, color)
    }
}
export function Box(width: number = 1, height: number = 1, length: number = 1, color: string = "gray", position: Vector = [0, 0, 0], orientation: Vector = [0, 0, 0], scale: Vector = [1, 1, 1]) {
    return new BoxImpl(position, orientation, scale, color, width, height, length)
}