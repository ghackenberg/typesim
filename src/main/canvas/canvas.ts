import { BoxImpl, Component, CompositeImpl, CylinderImpl, Display, ImageImpl, Model, Primitive, SphereImpl, Vector } from "../index.js"

export class Canvas {
    private context: CanvasRenderingContext2D
    constructor(private canvas: HTMLCanvasElement) {
        this.context = canvas.getContext("2d")
    }
    private renderComposite(position: Vector, orientation: Vector, scale: Vector, display: CompositeImpl) {
    
    }
    private renderBox(position: Vector, orientation: Vector, scale: Vector, display: BoxImpl) {
    
    }
    private renderSphere(position: Vector, orientation: Vector, scale: Vector, display: SphereImpl) {
    
    }
    private renderCylinder(position: Vector, orientation: Vector, scale: Vector, display: CylinderImpl) {
    
    }
    private renderPrimitive(position: Vector, orientation: Vector, scale: Vector, display: Primitive) {
        if (display instanceof BoxImpl) {
            this.renderBox(position, orientation, scale, display)
        } else if (display instanceof SphereImpl) {
            this.renderSphere(position, orientation, scale, display)
        } else if (display instanceof CylinderImpl) {
            this.renderCylinder(position, orientation, scale, display)
        } else {
            throw "Primitive type not supported!"
        }
    }
    private renderImage(position: Vector, orientation: Vector, scale: Vector, display: ImageImpl) {
    
    }
    private renderComponent(component: Component<any, any>) {
        const position = component.outputs.position as Vector
        const orientation = component.outputs.orientation as Vector
        const scale = component.outputs.scale as Vector
        const display = component.outputs.display as Display
        if (display instanceof CompositeImpl) {
            this.renderComposite(position, orientation, scale, display)
        } else if (display instanceof Primitive) {
            this.renderPrimitive(position, orientation, scale, display)
        } else if (display instanceof ImageImpl) {
            this.renderImage(position, orientation, scale, display)
        } else {
            throw "Display type not supported!"
        }
    }
    render(model: Model) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        for (const component of model.staticComponents) {
            this.renderComponent(component)
        }
        for (const component of model.dynamicComponents) {
            this.renderComponent(component)
        }
    }
}