type Fn = () => void

let currentEffect: Fn | null = null

export function state<T>(initial: T) {
  let value = initial
  const subs = new Set<Fn>()

  function get(): T {
    if (currentEffect) subs.add(currentEffect)
    return value
  }

  function set(next: T) {
    if (next !== value) {
      value = next
      for (const fn of subs) fn()
    }
  }

  return [get, set] as const
}

// run a reactive effect
export function effect(fn: Fn) {
  const run = () => {
    currentEffect = run
    fn()
    currentEffect = null
  }
  run()
}
