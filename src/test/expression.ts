import { And, Constant, IfThenElse, Variable } from "../main/index.js"

const x = Variable(true)
const a = And(x, Constant(true))
const i = IfThenElse(a, Constant("then branch"), Constant("else branch"))

x.watch(() => console.log("x has changed"))
a.watch(() => console.log("a has changed"))
i.watch(() => console.log("i has changed"))

console.log(i.get())

x.set(false)

console.log(i.get())

x.set(true)

console.log(i.get())