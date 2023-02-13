import { Display } from "../display.js"
import { Vector } from "../vector.js"

export class ImageImpl extends Display {
    constructor(position: Vector, orientation: Vector, scale: Vector, public src: string) {
        super(position, orientation, scale)
    }
}
export function Image(src: string, position: Vector = [0, 0, 0], orientation: Vector = [0, 0, 0], scale: Vector = [1, 1, 1]) {
    return new ImageImpl(position, orientation, scale, src)
}