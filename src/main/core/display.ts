import { Vector } from "./vector.js"

export abstract class Display {
    constructor(public position: Vector, public orientation: Vector, public scale: Vector) {
        
    }
}