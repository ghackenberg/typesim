import * as P5 from "p5"
import { BoxImpl, Component, CompositeImpl, CylinderImpl, Display, ImageImpl, Model, Primitive, SphereImpl, Vector } from "../index.js"

export class Canvas {
    private p: P5

    constructor(private model: Model) {
        this.p = new P5((p: P5) => {
            p.preload = () => {
                // empty
            }
            p.setup = () => {
                p.createCanvas(100, 100, p.WEBGL)
            }
            p.draw = () => {
                p.background(255)
                this.drawModel()
            }
        })
    }
    
    render() {
        this.p.redraw()
    }

    private drawComposite(display: CompositeImpl) {
        for (const child of display.children) {
            this.drawDisplay(child)
        }
    }
    private drawBox(display: BoxImpl) {
        this.p.box(display.width, display.height, display.length)
    }
    private drawSphere(display: SphereImpl) {
        this.p.sphere(display.radius)
    }
    private drawCylinder(display: CylinderImpl) {
        this.p.cylinder(display.radius, display.height)
    }
    private drawPrimitive(display: Primitive) {
        this.p.push()

        this.p.color(display.color)

        if (display instanceof BoxImpl) {
            this.drawBox(display)
        } else if (display instanceof SphereImpl) {
            this.drawSphere(display)
        } else if (display instanceof CylinderImpl) {
            this.drawCylinder(display)
        } else {
            throw "Primitive type not supported!"
        }

        this.p.pop()
    }
    private drawImage(display: ImageImpl) {
        throw "Image not implemented yet!"
    }
    private drawDisplay(display: Display) {
        const position = display.position
        const orientation = display.orientation
        const scale = display.scale
        
        this.p.push()
        
        this.p.translate(position[0], position[1], position[2])
        
        this.p.rotateX(orientation[0])
        this.p.rotateY(orientation[1])
        this.p.rotateZ(orientation[2])
        
        this.p.scale(scale[0], scale[1], scale[2])

        if (display instanceof CompositeImpl) {
            this.drawComposite(display)
        } else if (display instanceof Primitive) {
            this.drawPrimitive(display)
        } else if (display instanceof ImageImpl) {
            this.drawImage(display)
        } else {
            throw "Display type not supported!"
        }

        this.p.pop()
    }
    private drawComponent(component: Component<any, any>) {
        const position = component.outputs.position as Vector
        const orientation = component.outputs.orientation as Vector
        const scale = component.outputs.scale as Vector
        const display = component.outputs.display as Display
        
        this.p.push()
        
        this.p.translate(position[0], position[1], position[2])
        
        this.p.rotateX(orientation[0])
        this.p.rotateY(orientation[1])
        this.p.rotateZ(orientation[2])
        
        this.p.scale(scale[0], scale[1], scale[2])

        this.drawDisplay(display)

        this.p.pop()
    }
    private drawModel() {
        for (const c of this.model.staticComponents) {
            this.drawComponent(c)
        }
        for (const c of this.model.dynamicComponents) {
            this.drawComponent(c)
        }
    }
}