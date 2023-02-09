type ObservableListener<T> = (observable: Observable<T>, oldValue: T, newValue: T) => void

export abstract class Observable<T> {
    private listeners: ObservableListener<T>[] = []

    abstract get(): T

    watch(listener: ObservableListener<T>) {
        this.listeners.push(listener)
    }
    unwatch(listener: ObservableListener<T>) {
        this.listeners.splice(this.listeners.indexOf(listener), 1)
    }

    protected notify(oldValue: T, newValue: T) {
        for (const listener of this.listeners) {
            listener(this, oldValue, newValue)
        }
    }
}

class ConstantImpl<T> extends Observable<T> {
    constructor(private value: T) {
        super()
    }
    override get() {
        return this.value
    }
}
export function Constant<T>(value: T) {
    return new ConstantImpl(value)
}
export function Const<T>(value: T) {
    return new ConstantImpl(value)
}

class VariableImpl<T> extends Observable<T> {
    constructor(private value: T) {
        super()
    }
    set(newValue: T) {
        if (newValue != this.value) {
            const oldValue = this.value

            this.value = newValue
    
            this.notify(oldValue, newValue)
        }
    }
    override get() {
        return this.value
    }
}
export function Variable<T>(value: T) {
    return new VariableImpl(value)
}
export function Var<T>(value: T) {
    return new VariableImpl(value)
}

export abstract class MapImpl<S, T> extends Observable<T> {
    private value: T
    constructor(private child: Observable<S>) {
        super()
        this.child.watch(() => this.update())
        this.update()
    }
    override get() {
        return this.value
    }
    private update() {
        const oldValue = this.value
        const newValue = this.map(this.child.get())
        if (newValue != oldValue) {
            this.value = newValue
            this.notify(oldValue, newValue)
        }
    }
    protected abstract map(v: S): T
}

class InvertImpl extends MapImpl<boolean, boolean> {
    constructor(child: Observable<boolean>) {
        super(child)
    }
    protected override map(v: boolean) {
        return !v
    }
}
export function Invert(child: Observable<boolean>) {
    return new InvertImpl(child)
}

class NegateImpl extends MapImpl<number, number> {
    constructor(child: Observable<number>) {
        super(child)
    }
    protected override map(v: number) {
        return -v
    }
}
export function Negate(child: Observable<number>) {
    return new NegateImpl(child)
}

export abstract class NaryImpl<S, T> extends Observable<T> {
    private value: T
    protected children: Observable<S>[]
    constructor(protected first: Observable<S>, ...children: Observable<S>[]) {
        super()
        this.first.watch(() => this.update())
        this.children = children
        for (const child of children) {
            child.watch(() => this.update())
        }
        this.update()
    }
    override get() {
        return this.value
    }
    private update() {
        const oldValue = this.value
        const newValue = this.compute()
        if (newValue != oldValue) {
            this.value = newValue
            this.notify(oldValue, newValue)
        }
    }
    protected abstract compute(): T
}

export abstract class CompareImpl<T> extends NaryImpl<T, boolean> {
    constructor(first: Observable<T>, ...children: Observable<T>[]) {
        super(first, ...children)
    }
    protected override compute(): boolean {
        let previous = this.first.get()
        for (const child of this.children) {
            const current = child.get()
            if (!this.compare(previous, current)) {
                return false
            }
            previous = current
        }
        return true
    }
    protected abstract compare(a: T, b: T): boolean
}

class EqualImpl<T> extends CompareImpl<T> {
    constructor(first: Observable<T>, ...children: Observable<T>[]) {
        super(first, ...children)
    }
    protected override compare(a: T, b: T) {
        return a == b
    }
}
export function Equal<T>(first: Observable<T>, ...children: Observable<T>[]) {
    return new EqualImpl(first, ...children)
}

class SmallerImpl extends CompareImpl<number> {
    constructor(first: Observable<number>, ...children: Observable<number>[]) {
        super(first, ...children)
    }
    protected override compare(a: number, b: number) {
        return a < b
    }
}
export function Smaller<T>(first: Observable<number>, ...children: Observable<number>[]) {
    return new SmallerImpl(first, ...children)
}

class GreaterImpl extends CompareImpl<number> {
    constructor(first: Observable<number>, ...children: Observable<number>[]) {
        super(first, ...children)
    }
    protected override compare(a: number, b: number) {
        return a > b
    }
}
export function Greater<T>(first: Observable<number>, ...children: Observable<number>[]) {
    return new GreaterImpl(first, ...children)
}

export abstract class Reduce<T> extends NaryImpl<T, T> {
    constructor(first: Observable<T>, ...children: Observable<T>[]) {
        super(first, ...children)
    }
    protected override compute() {
        return this.children.map(child => child.get()).reduce(this.reduce, this.first.get())
    }
    protected abstract reduce(a: T, b: T): T
}

class AndImpl extends Reduce<boolean> {
    constructor(first: Observable<boolean>, ...children: Observable<boolean>[]) {
        super(first, ...children)
    }
    protected override reduce(a: boolean, b: boolean) {
        return a && b
    }
}
export function And(first: Observable<boolean>, ...children: Observable<boolean>[]) {
    return new AndImpl(first, ...children)
}

class OrImpl extends Reduce<boolean> {
    constructor(first: Observable<boolean>, ...children: Observable<boolean>[]) {
        super(first, ...children)
    }
    protected override reduce(a: boolean, b: boolean) {
        return a || b
    }
}
export function Or(first: Observable<boolean>, ...children: Observable<boolean>[]) {
    return new OrImpl(first, ...children)
}

class AddImpl extends Reduce<number> {
    constructor(first: Observable<number>, ...children: Observable<number>[]) {
        super(first, ...children)
    }
    protected override reduce(a: number, b: number) {
        return a + b
    }
}
export function Add(first: Observable<number>, ...children: Observable<number>[]) {
    return new AddImpl(first, ...children)
}

class SubstractImpl extends Reduce<number> {
    constructor(first: Observable<number>, ...children: Observable<number>[]) {
        super(first, ...children)
    }
    protected override reduce(a: number, b: number) {
        return a - b
    }
}
export function Substract(first: Observable<number>, ...children: Observable<number>[]) {
    return new SubstractImpl(first, ...children)
}

class MultiplyImpl extends Reduce<number> {
    constructor(first: Observable<number>, ...children: Observable<number>[]) {
        super(first, ...children)
    }
    protected override reduce(a: number, b: number) {
        return a * b
    }
}
export function Multiply(first: Observable<number>, ...children: Observable<number>[]) {
    return new MultiplyImpl(first, ...children)
}

class DivideImpl extends Reduce<number> {
    constructor(first: Observable<number>, ...children: Observable<number>[]) {
        super(first, ...children)
    }
    protected override reduce(a: number, b: number) {
        return a / b
    }
}
export function Divide(first: Observable<number>, ...children: Observable<number>[]) {
    return new DivideImpl(first, ...children)
}

class IfThenElseImpl<T> extends Observable<T> {
    private value: T
    constructor(private _if: Observable<boolean>, private _then: Observable<T>, private _else: Observable<T>) {
        super()
        this._if.watch(() => this.update())
        this._then.watch(() => this.update())
        this._else.watch(() => this.update())
        this.update()
    }
    override get() {
        return this.value
    }
    private update() {
        const oldValue = this.value
        const newValue = this._if.get() ? this._then.get() : this._else.get()
        if (newValue != oldValue) {
            this.value = newValue
            this.notify(oldValue, newValue)
        }
    }
}
export function IfThenElse<T>(_if: Observable<boolean>, _then: Observable<T>, _else: Observable<T>) {
    return new IfThenElseImpl(_if, _then, _else)
}