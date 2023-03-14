import { AmbientLight, BoxGeometry, BufferGeometry, CylinderGeometry, DirectionalLight, GridHelper, Group, Mesh, MeshPhongMaterial, Object3D, PerspectiveCamera, Scene, SphereGeometry, Vector3, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
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
        this.camera.position.x = 50
        this.camera.position.y = 100
        this.camera.position.z = 100
        this.camera.lookAt(new Vector3(0, 0, 0))

        new OrbitControls(this.camera, this.renderer.domElement)

        this.ambient = new AmbientLight(0xffffff, 0.5)

        this.directional = new DirectionalLight(0xffffff, 1)
        this.directional.position.x = 25
        this.directional.position.y = 100
        this.directional.position.z = 50

        this.group = new Group()

        const grid = new GridHelper(100, 10)

        this.scene = new Scene()
        this.scene.add(this.ambient)
        this.scene.add(this.directional)
        this.scene.add(this.group)
        this.scene.add(grid)

        this.canvas = this.renderer.domElement

        window.addEventListener("resize", () => {
            this.resize()
        })
        
        this.resize()
    }

    private resize() {
        const width = window.innerWidth
        const height = window.innerHeight

        this.renderer.setSize(width, height)

        const aspect = width / height

        this.camera.aspect = aspect
        this.camera.updateProjectionMatrix()

        this.render()
    }
    
    private render() {
        requestAnimationFrame(this.render.bind(this))

        if (this.model.simulation) {
            this.group.clear()
            this.group.add(this.drawModel())
        }

        this.renderer.render(this.scene, this.camera)
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

        object.position.x = position[0]
        object.position.y = position[1]
        object.position.z = position[2]

        return object
    }
    private drawComponent(component: Component<any, any>) {
        const position = component.outputs.position as Vector
        const orientation = component.outputs.orientation as Vector
        const scale = component.outputs.scale as Vector
        const display = component.outputs.display as Display

        const object = this.drawDisplay(display)

        object.position.x = position[0]
        object.position.y = position[1]
        object.position.z = position[2]

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