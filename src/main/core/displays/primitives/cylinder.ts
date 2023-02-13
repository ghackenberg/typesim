import { Vector } from "../../vector.js"
import { Primitive } from "../primitive.js"

export class CylinderImpl extends Primitive {
    constructor(position: Vector, orientation: Vector, scale: Vector, color: string, public radius: number, public height: number) {
        super(position, orientation, scale, color)
    }
}
export function Cylinder(radius = 1, height = 1, color = "gray", position: Vector = [0, 0, 0], orientation: Vector = [0, 0, 0], scale: Vector = [1, 1, 1]) {
    return new CylinderImpl(position, orientation, scale, color, radius, height)
}