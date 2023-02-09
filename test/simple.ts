import { Random, Environment, Resource } from '../src/index'

function *customer(index: number, rnd: Random, env: Environment, res: Resource) {
    yield env.wait(rnd.next(0, 5))
    yield res.require()
    console.log(`customer ${index} being served at ${env.time}`)
    res.release()
}

const rnd = new Random()

const env = new Environment()

const res = new Resource(env)

env.process(customer(0, rnd, env, res))
env.process(customer(1, rnd, env, res))
env.process(customer(2, rnd, env, res))
env.process(customer(3, rnd, env, res))
env.process(customer(4, rnd, env, res))

env.run()