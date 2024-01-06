import { FunctionExtensions } from './functionextensions.js'
import { ObjectExtensions } from './objectextensions.js'
import { ReflectExtensions } from './reflectextensions.js'
import { StringExtensions } from './stringextensions.js'
import { SymbolExtensions } from './symbolextensions.js'
import { ArrayPrototypeExtensions } from './arrayextensions.js'
import { DescriptorExtension } from './descriptor.js'

import { Patch } from '@nejs/extension'

const Owners = [
  Object,
  Function,
  Reflect,
  String,
  Symbol,

  Array.prototype,
]

const NetNew = [
  DescriptorExtension,
]

export function enableAll(owners) {
  (owners || Owners).forEach(owner => {
    Patch.enableFor(owner)
  })

  (NetNew).forEach(extension => {
    extension.apply()
  })
}

export function disableAll(owners) {
  (owners || Owners).forEach(owner => {
    Patch.disableFor(owner)
  })

  (NetNew).forEach(extension => {
    extension.revert()
  })
}

export {
  ObjectExtensions,
  FunctionExtensions,
  ReflectExtensions,
  StringExtensions,
  SymbolExtensions,
  ArrayPrototypeExtensions,
}