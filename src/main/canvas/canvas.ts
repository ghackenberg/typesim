import { PerspectiveCamera, Scene, WebGLRenderer } from "three"
import { BoxImpl, Component, CompositeImpl, CylinderImpl, Display, ImageImpl, Model, Primitive, SphereImpl, Vector } from "../index.js"

export class Canvas {
    public element: HTMLCanvasElement

    private renderer: WebGLRenderer
    private scene: Scene
    private camera: PerspectiveCamera

    constructor(private model: Model, canvas: HTMLCanvasElement = undefined) {
        this.renderer = new WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            logarithmicDepthBuffer: true
        })
        this.renderer.setPixelRatio(window.devicePixelRatio)

        this.camera = new PerspectiveCamera()

        this.scene = new Scene()

        this.element = this.renderer.domElement
        this.element.addEventListener("resize", () => {
            this.resize()
            this.render()
        })

        this.resize()
    }

    private resize() {
        const width = this.element.offsetWidth
        const height = this.element.offsetHeight

        this.renderer.setSize(width, height)

        const aspect = width / height

        this.camera.aspect = aspect
        this.camera.updateProjectionMatrix()
    }
    
    render() {
        this.renderer.render(this.scene, this.camera)
    }

    private drawComposite(display: CompositeImpl) {
        for (const child of display.children) {
            this.drawDisplay(child)
        }
    }
    private drawBox(display: BoxImpl) {

    }
    private drawSphere(display: SphereImpl) {

    }
    private drawCylinder(display: CylinderImpl) {

    }
    private drawPrimitive(display: Primitive) {
        if (display instanceof BoxImpl) {
            this.drawBox(display)
        } else if (display instanceof SphereImpl) {
            this.drawSphere(display)
        } else if (display instanceof CylinderImpl) {
            this.drawCylinder(display)
        } else {
            throw "Primitive type not supported!"
        }
    }
    private drawImage(display: ImageImpl) {
        throw "Image not implemented yet!"
    }
    private drawDisplay(display: Display) {
        const position = display.position
        const orientation = display.orientation
        const scale = display.scale

        if (display instanceof CompositeImpl) {
            this.drawComposite(display)
        } else if (display instanceof Primitive) {
            this.drawPrimitive(display)
        } else if (display instanceof ImageImpl) {
            this.drawImage(display)
        } else {
            throw "Display type not supported!"
        }
    }
    private drawComponent(component: Component<any, any>) {
        const position = component.outputs.position as Vector
        const orientation = component.outputs.orientation as Vector
        const scale = component.outputs.scale as Vector
        const display = component.outputs.display as Display

        this.drawDisplay(display)
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