import { FunctionExtensions } from './functionextensions.js'
import { ObjectExtensions, ObjectPrototypeExtensions } from './objectextensions.js'
import { MapPrototypeExtensions } from './mapextensions.js'
import { ReflectExtensions } from './reflectextensions.js'
import { StringExtensions } from './stringextensions.js'
import { SymbolExtensions } from './symbolextensions.js'
import { ArrayPrototypeExtensions } from './arrayextensions.js'
import { DescriptorExtensions, Descriptor } from './newClasses/descriptor.js'
import { GlobalFunctionsAndProps } from './globals.js'
import { RefSetExtensions } from './newClasses/refset.js'
import { RefMapExtensions } from './newClasses/refmap.js'

import {
  AsyncIteratorExtensions,
  AsyncIterableExtensions
} from './newClasses/asyncIterable.js'

import {
  IteratorExtensions,
  IterableExtensions
} from './newClasses/iterable.js'

const Patches = new Map([
  [Object, ObjectExtensions],
  [Function, FunctionExtensions],
  [Reflect, ReflectExtensions],
  [String, StringExtensions],
  [Symbol, SymbolExtensions],

  [Object.prototype, ObjectPrototypeExtensions],
  [Array.prototype, ArrayPrototypeExtensions],
  [Map.prototype, MapPrototypeExtensions],
  [globalThis, GlobalFunctionsAndProps],
])

const Extensions = {
  [DescriptorExtensions.key]: DescriptorExtensions,
  [AsyncIterableExtensions.key]: AsyncIterableExtensions,
  [AsyncIteratorExtensions.key]: AsyncIteratorExtensions,
  [IterableExtensions.key]: IterableExtensions,
  [IteratorExtensions.key]: IteratorExtensions,
  [RefSetExtensions.key]: RefSetExtensions,
  [RefMapExtensions.key]: RefMapExtensions,
}

const Controls = {}

Object.assign(Controls, {
  enableAll() {
    Controls.enablePatches()
    Controls.enableExtensions()
  },

  enablePatches() {
    Patches.forEach((extension) => { extension.apply() })
  },

  enableExtensions() {
    Object.values(Extensions).forEach((extension) => { extension.apply() })
  },

  disableAll(owners) {
    Controls.disablePatches()
    Controls.disableExtensions()
  },

  disablePatches() {
    Patches.forEach((extension) => { extension.revert() })
  },

  disableExtensions() {
    Object.values(Extensions).forEach((extension) => { extension.revert() })
  },
})

export const all = (() => {
  const extensions = [
    ...Array.from(Patches.values()),
    ...Array.from(Object.values(Extensions)),
  ]

  const dest = extensions.reduce((accumulator, extension) => {
    Reflect.ownKeys(extension.patchEntries).reduce((_, key) => {
      const entry = extension.patchEntries[key]

      if (entry.isAccessor)
        accumulator[key] = new Descriptor(entry.descriptor)
      else
        accumulator[key] = entry.computed

      return accumulator
    }, accumulator)

    return accumulator
  }, {})

  return dest
})()

const results = {
  ...Controls,
  extensions: Extensions,
  patches: Patches,
  all,
}

export default results

export {
  Extensions,
  Patches,
  Controls,
}
