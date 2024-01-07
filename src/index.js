import { FunctionExtensions } from './functionextensions.js'
import { ObjectExtensions } from './objectextensions.js'
import { ReflectExtensions } from './reflectextensions.js'
import { StringExtensions } from './stringextensions.js'
import { SymbolExtensions } from './symbolextensions.js'
import { ArrayPrototypeExtensions } from './arrayextensions.js'
import { DescriptorExtension } from './descriptor.js'
import { GlobalFunctionsAndProps } from './globals.js'

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
  GlobalFunctionsAndProps,
  DescriptorExtension,
]

export function enableAll(owners) {
  const list = owners || Owners

  if (!list) {
    throw new Error('Unable to enable features without owners list')
  }

  list.forEach(owner => {
    Patch.enableFor(owner)
  })

  NetNew.forEach(extension => {
    extension.apply()
  })
}

export function disableAll(owners) {
  const list = owners || Owners

  if (!list) {
    throw new Error('Unable to disable features without owners list')
  }

  list.forEach(owner => {
    Patch.disableFor(owner)
  })

  NetNew.forEach(extension => {
    extension.revert()
  })
}

export const all = (() => {
  let extensions = [
    ObjectExtensions,
    FunctionExtensions,
    ReflectExtensions,
    StringExtensions,
    SymbolExtensions,
    ArrayPrototypeExtensions,

    GlobalFunctionsAndProps,
    DescriptorExtension,
  ]

  const dest = extensions.reduce((accumulator, extension) => {
    Reflect.ownKeys(extension.patchEntries).reduce((_, key) => {
      accumulator[key] = extension.patchEntries[key].computed
      return accumulator
    }, accumulator)

    return accumulator
  }, {})

  return dest
})()


export {
  ObjectExtensions,
  FunctionExtensions,
  ReflectExtensions,
  StringExtensions,
  SymbolExtensions,
  ArrayPrototypeExtensions,

  GlobalFunctionsAndProps,
  DescriptorExtension,
}