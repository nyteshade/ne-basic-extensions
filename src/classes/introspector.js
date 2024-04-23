import { Extension } from '@nejs/extension'

export class Introspector {
  static addExpansion(array) {
    const toEntriesFrom = (owner = globalThis) => {
      return (accumulator, key) => {
        const count = accumulator.length;

        try {
          const value = owner[key]
          accumulator.splice(count, 0, [key, value], [value, key])
        }
        catch (error) { accumulator.splice(count, 0, [key, error]) }

        return accumulator
      }
    }

    return Object.defineProperty(array, 'expand', {
      get() {
        return new Map(
          this.reduce(toEntriesFrom(globalThis), [])
        )
      },
      configurable: true,
      enumerable: true,
    })
  }

  static accessors(owner = globalThis, keys = []) {
    const entries = []

    for (const key of keys) {
      try {
        const metadata = this.metadata(owner, key)
        if (metadata.get || metadata.set) {
          entries.push([key, metadata])
        }
        continue
      }
      catch (error) {
        entries.push([key, error])
      }
    }

    return new Map(entries)
  }

  static classes(owner = globalThis) {
    return this.fetcher(
      'function', /^[A-Z]/, Object, 'getOwnPropertyNames', owner
    )
  }

  static functions(owner = globalThis) {
    return this.fetcher(
      'function', /^[a-z]/, Object, 'getOwnPropertyNames', owner
    )
  }

  static objects(owner = globalThis) {
    return this.fetcher('object', null, Object, 'getOwnPropertyNames', owner)
  }

  static properties(owner = globalThis) {
    return this.fetcher(
      (v,t,d) => t !== 'object' && t !== 'function',
      null, Object, 'getOwnPropertyNames', owner
    )
  }

  static symbols(owner = globalThis) {
    return this.addExpansion(Object.getOwnPropertySymbols(owner))
  }

  static metadata(owner, key) {
    const metadata = {
      owner, key,
      descriptor: undefined,
      value: undefined,
      get type() { return typeof this.value },
    }

    try { metadata.descriptor = Object.getOwnPropertyDescriptor(owner, key) }
    catch(error) { metadata.descriptor = error }

    try {
      metadata.value = (
        metadata.descriptor?.value ??
        metadata.descriptor?.get?.bind(owner)?.() ??
        owner[key]
      )
    }
    catch(error) { metadata.value = error }

    return metadata
  }

  static fetcher(
    typeNameOrTyperFn,
    regExp = undefined,
    searchClass = Object,
    searchFunction = 'getOwnPropertyNames',
    owner = globalThis
  ) {
    let typer = typeNameOrTyperFn

    if (typeof typeNameOrTyperFn !== 'function') {
      const type = String(typeNameOrTyperFn)
      typer = (function(value, typeName, descriptor) {
        return typeName === type
      }).bind(this)
    }

    return this.addExpansion(
      searchClass[searchFunction](owner).filter(key => {
        const metadata = this.metadata(owner, key)
        return (
          (!regExp || regExp.exec(String(key))) &&
          typer(metadata.value, metadata.type, metadata.descriptor)
        )
      }).toSorted()
    )
  }

  static makeReport(owner = globalThis) {
    let names = [
      'classes', 'functions', 'objects', 'properties', 'symbols', 'accessors'
    ];
    let bound = names.reduce(
      (a,n) => { a[n] = this[n].bind(this); return a },
      {}
    )
    const { classes, functions, objects, properties, symbols, accessors } = bound
    const result = { }

    Object.assign(result, {
      accessors: {
        classes: undefined,
        functions: undefined,
        objects: undefined,
        properties: undefined,
        symbols: undefined,
      },
      classes: this[classes.name](),
      functions: this[functions.name](),
      objects: this[objects.name](),
      properties: this[properties.name](),
      symbols: this[symbols.name](),
      expandAll() {
        names.forEach(reportName => {
          result[reportName] = result?.[reportName]?.expand
        })
      },
    })

    (names.forEach(type => {
        debugger
        result.accessors[type] = accessors(globalThis, result[type])
      })
    )

    return result
  }
}

export const IntrospectorExtensions = new Extension(Introspector);