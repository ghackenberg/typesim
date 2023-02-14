import { AmbientLight, BoxGeometry, BufferGeometry, CylinderGeometry, DirectionalLight, Group, Mesh, MeshPhongMaterial, Object3D, PerspectiveCamera, Scene, SphereGeometry, Vector3, WebGLRenderer } from "three"
import { BoxImpl, Component, CompositeImpl, CylinderImpl, Display, ImageImpl, Model, Primitive, SphereImpl, Vector } from "../index.js"

export class View {
    public canvas: HTMLCanvasElement

    private renderer: WebGLRenderer
    private camera: PerspectiveCamera
    private ambient: AmbientLight
    private directional: DirectionalLight
    private scene: Scene
    private group: Group

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

        this.group = new Group()

        this.scene = new Scene()
        this.scene.add(this.ambient)
        this.scene.add(this.directional)
        this.scene.add(this.group)

        this.canvas = this.renderer.domElement

        window.addEventListener("resize", () => {
            this.resize()
            this.render()
        })

        this.resize()
    }
    
    render() {
        this.group.clear()
        this.group.add(this.drawModel())
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
        const group = new Group()
        for (const child of display.children) {
            group.add(this.drawDisplay(child))
        }
        return group
    }
    private drawBox(display: BoxImpl) {
        return new BoxGeometry(display.width, display.height, display.length)
    }
    private drawSphere(display: SphereImpl) {
        return new SphereGeometry(display.radius)
    }
    private drawCylinder(display: CylinderImpl) {
        return new CylinderGeometry(display.radius, display.radius, display.height)
    }
    private drawPrimitive(display: Primitive) {
        const material = new MeshPhongMaterial({ color: display.color })
        let geometry: BufferGeometry
        if (display instanceof BoxImpl) {
            geometry = this.drawBox(display)
        } else if (display instanceof SphereImpl) {
            geometry = this.drawSphere(display)
        } else if (display instanceof CylinderImpl) {
            geometry = this.drawCylinder(display)
        } else {
            throw "Primitive type not supported!"
        }
        return new Mesh(geometry, material)
    }
    private drawImage(display: ImageImpl): Object3D {
        throw "Image not implemented yet!"
    }
    private drawDisplay(display: Display) {
        const position = display.position
        const orientation = display.orientation
        const scale = display.scale

        let object: Object3D

        if (display instanceof CompositeImpl) {
            object = this.drawComposite(display)
        } else if (display instanceof Primitive) {
            object = this.drawPrimitive(display)
        } else if (display instanceof ImageImpl) {
            object = this.drawImage(display)
        } else {
            throw "Display type not supported!"
        }

        return object
    }
    private drawComponent(component: Component<any, any>) {
        const position = component.outputs.position as Vector
        const orientation = component.outputs.orientation as Vector
        const scale = component.outputs.scale as Vector
        const display = component.outputs.display as Display

        const object = this.drawDisplay(display)

        return object
    }
    private drawModel() {
        const group = new Group()
        for (const c of this.model.staticComponents) {
            group.add(this.drawComponent(c))
        }
        for (const c of this.model.dynamicComponents) {
            group.add(this.drawComponent(c))
        }
        return group
    }
}