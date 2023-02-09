import { And, Const, IfThenElse, Var } from "../main/index.js"

const x = Var(true)
const a = And(x, Const(true))
const i = IfThenElse(a, Const("then branch"), Const("else branch"))

x.watch(() => console.log("x has changed"))
a.watch(() => console.log("a has changed"))
i.watch(() => console.log("i has changed"))

console.log(i.get())

x.set(false)

console.log(i.get())

x.set(true)

console.log(i.get())