import { Vector } from "../vector.js"
import { Primitive } from "./primitive.js"

export class SphereImpl extends Primitive {
    constructor(position: Vector, orientation: Vector, scale: Vector, color: string, public radius: number) {
        super(position, orientation, scale, color)
    }
}
export function Sphere(radius = 1, color = "gray", position: Vector = [0, 0, 0], orientation: Vector = [0, 0, 0], scale: Vector = [1, 1, 1]) {
    return new SphereImpl(position, orientation, scale, color, radius)
}