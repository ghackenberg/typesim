import { View, Model } from "../main/index"
import { simple } from "./simple"

const model = new Model()

simple()

const canvas = document.createElement("canvas")
canvas.style.position = "absolute"
canvas.style.top = "0"
canvas.style.left = "0"

const view = new View(model, canvas)

document.body.appendChild(canvas)

model.simulate(10000, 1, () => view.render())