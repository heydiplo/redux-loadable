// @flow
import { compact, map, keys, isArray } from 'lodash'

export default (object: any): ?string => {
  const seen = []

  const stringify = (node) => {
    if (node === undefined) { return }

    if (typeof node !== 'object' || node === null) {
      return JSON.stringify(node)
    }

    if (isArray(node)) {
      const values = map(node, (value) => (
        stringify(value) ||
        JSON.stringify(null)
      ))

      return `[${values.join(',')}]`
    }

    if (seen.indexOf(node) !== -1) {
      throw new TypeError('Converting circular structure to JSON')
    } else {
      seen.push(node)
    }

    const out = compact(map(keys(node).sort(), (key) => {
      const value = stringify(node[key])

      if (!value) return null

      return `${JSON.stringify(key)}: ${value}`
    }))

    seen.splice(seen.indexOf(node), 1)
    return `{${out.join(',')}}`
  }

  return stringify(object)
}

