import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, SphereGeometry, Vector3, WebGLRenderer } from "three"
import { BoxImpl, Component, CompositeImpl, CylinderImpl, Display, ImageImpl, Model, Primitive, SphereImpl, Vector } from "../index.js"

export class View {
    public canvas: HTMLCanvasElement

    private renderer: WebGLRenderer
    private camera: PerspectiveCamera
    private ambient: AmbientLight
    private directional: DirectionalLight
    private scene: Scene

    constructor(private model: Model, canvas: HTMLCanvasElement = undefined) {
        this.renderer = new WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            logarithmicDepthBuffer: true
        })
        this.renderer.setPixelRatio(window.devicePixelRatio)

        this.camera = new PerspectiveCamera()
        this.camera.position.x = 5
        this.camera.position.y = 5
        this.camera.position.z = 5
        this.camera.lookAt(new Vector3(0, 0, 0))

        this.ambient = new AmbientLight(0xffffff, 0.5)

        this.directional = new DirectionalLight(0xffffff, 1)
        this.directional.position.x = 5
        this.directional.position.y = 2.5
        this.directional.position.z = 0
        
        const geometry = new BoxGeometry()
        const material = new MeshPhongMaterial({ color: 0xff0000 })
        const mesh = new Mesh(geometry, material)

        this.scene = new Scene()
        this.scene.add(this.ambient)
        this.scene.add(this.directional)
        this.scene.add(mesh)

        this.canvas = this.renderer.domElement

        window.addEventListener("resize", () => {
            this.resize()
            this.render()
        })

        this.resize()
    }
    
    render() {
        this.renderer.render(this.scene, this.camera)
    }

    private resize() {
        const width = window.innerWidth
        const height = window.innerHeight

        this.renderer.setSize(width, height)

        const aspect = width / height

        this.camera.aspect = aspect
        this.camera.updateProjectionMatrix()
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