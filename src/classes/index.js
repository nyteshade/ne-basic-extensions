import { Patch } from '@nejs/extension'

import { AsyncIterable, AsyncIterator } from './asyncIterable.js'
export * from './asyncIterable.js'

import { Deferred } from './deferred.js'
export * from './deferred.js'

import { Descriptor } from './descriptor.js'
export * from './descriptor.js'

import { Introspector } from './introspector.js'
export * from './introspector.js'

import {Iterable, Iterator } from './iterable.js'
export * from './iterable.js'

import { ParamParser } from './param.parser.js'
export * from './param.parser.js'

import { PluggableProxy, ProxyHandler } from './pluggable.proxy.js'
export * from './pluggable.proxy.js'

import { Property, PropertyExtensions } from './property.js'
export * from './property.js'

import { RefMap  } from './refmap.js'
export * from './refmap.js'

import { RefSet } from './refset.js'
export * from './refset.js'

import { Symkeys } from './symkeys.js'
export * from './symkeys.js'

import { Type } from './type.js'
export * from './type.js'

export const NewClassesExtension = new Patch(globalThis, {
  AsyncIterable,
  AsyncIterator,
  Deferred,
  Descriptor,
  Introspector,
  Iterable,
  Iterator,
  ParamParser,
  PluggableProxy,
  ProxyHandler,
  Property,
  RefMap,
  RefSet,
  Symkeys,
  Type,
})