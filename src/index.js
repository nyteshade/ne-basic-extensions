import { FunctionExtensions } from './functionextensions.js'
import { ObjectExtensions } from './objectextensions.js'
import { ReflectExtensions } from './reflectextensions.js'
import { StringExtensions } from './stringextensions.js'
import { SymbolExtensions } from './symbolextensions.js'
import { ArrayPrototypeExtensions } from './arrayextensions.js'

import { Patch } from '@nejs/extension'

const Owners = [
  Object,
  Function,
  Reflect,
  String,
  Symbol,

  Array.prototype,
]

export function enableAll(owners) {
  (owners || Owners).forEach(owner => {
    Patch.enableFor(owner)
  })
}

export function disableAll(owners) {
  (owners || Owners).forEach(owner => {
    Patch.disableFor(owner)
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