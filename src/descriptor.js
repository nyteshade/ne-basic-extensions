import { Extension } from '@nejs/extension'
import { ObjectExtensions } from './objectextensions.js'
import { StringExtensions } from './stringextensions.js'
import { ReflectExtensions } from './reflectextensions.js'

const isObject = ObjectExtensions.patchEntries?.isObject?.computed
const isValidKey = ObjectExtensions.patchEntries?.isValidKey?.computed
const isString = StringExtensions.patchEntries?.isString?.computed
const hasSome = ReflectExtensions.patchEntries?.hasSome?.computed

class Descriptor {
  #desc = Descriptor.enigmatic

  /**
   * Creates a new instance of Descriptor either from another object or
   * around the supplied object descriptor value.
   *
   * @param {object} object either an object descriptor or the object
   * from which to get the descriptor
   * @param {symbol|string} key a valid key for accessing the descriptor
   * on the aforesupplied object.
   */
  constructor(object, key) {
    this.#desc = object

    if (isObject(object) && isValidKey(key)) {
      this.#desc = Object.getOwnPropertyDescriptor(object, key)
    }

    if (!this.isDescriptor) {
      throw new Error(`Not a valid descriptor:`, this.#desc)
    }
  }

  /**
   * Detects whether or not this instance is an accessor object descriptor
   *
   * @returns {boolean} true if this object has a getter or setter and is not
   * a data descriptor
   */
  get isAccessor() {
    return Descriptor.isAccessor(this.#desc)
  }

  /**
   * Detects whether or not this instance is an data object descriptor
   *
   * @returns {boolean} true if this object has a value property and is not
   * an accessor descriptor
   */
  get isData() {
    return Descriptor.isData(this.#desc)
  }

  /**
   * Detects whether or not this instance is a valid object descriptor
   *
   * @returns {boolean} true if this descriptor store is a valid descriptor
   */
  get isDescriptor() {
    return Descriptor.isDescriptor(this.#desc)
  }

  /**
   * Getter around the `configurable` object descriptor property of
   * this instance of Descriptor.
   *
   * @returns {boolean} a boolean value or undefined if the internal
   * descriptor store is invalid.
   */
  get configurable() {
    return !!this.#desc?.configurable
  }

  /**
   * Sets the `configurable` value of this object. If the internal descriptor
   * store store is invalid, the value is thrown away
   *
   * @param {boolean} value the value to set for the `configurable` descriptor
   * property. If this value is not a `boolean` it will be converted to one
   */
  set configurable(value) {
    (this.#desc || {}).configurable = !!value
  }

  /**
   * Getter around the `enumerable` object descriptor property of
   * this instance of Descriptor.
   *
   * @returns {boolean} a boolean value or undefined if the internal
   * descriptor store is invalid.
   */
  get enumerable() {
    return this.#desc?.enumerable
  }

  /**
   * Sets the `enumerable` value of this object. If the internal descriptor
   * store is invalid, the value is thrown away
   *
   * @param {boolean} value the value to set for the `enumerable` descriptor
   * property. If this value is not a `boolean` it will be converted to one
   */
  set enumerable(value) {
    (this.#desc || {}).enumerable = value
  }

  /**
   * Getter around the `writable` object descriptor property of
   * this instance of Descriptor.
   *
   * @returns {boolean} a boolean value or undefined if the internal
   * descriptor store is invalid.
   */
  get writable() {
    return this.#desc?.writable
  }

  /**
   * Sets the `writable` value of this object. If the internal descriptor
   * store is invalid, the value is thrown away
   *
   * @param {boolean} value the value to set for the `writable` descriptor
   * property. If this value is not a `boolean` it will be converted to one
   */
  set writable(value) {
    (this.#desc || {}).writable = value
  }

  /**
   * Getter around the `value` object descriptor property of
   * this instance of Descriptor.
   *
   * @returns {any} any value stored in this descriptor
   */
  get value() {
    return this.#desc?.value
  }

  /**
   * Sets the `value` value of this object. If the internal descriptor
   * store is invalid, the value is thrown away
   *
   * @param {any} value the value to set for the `value` descriptor
   * property.
   */
  set value(value) {
    (this.#desc || {}).value = value
  }

  /**
   * Getter around the `get` object descriptor property of
   * this instance of Descriptor.
   *
   * @returns {function} a function if the getter for this descriptor is
   * defined or `undefined` if the internal descriptor object or the getter
   * is undefined.
   */
  get get() {
    return this.#desc?.get
  }

  /**
   * Sets the `get` value of this object. If the internal descriptor
   * store is invalid, the value is thrown away
   *
   * @param {function} value the getter function for this descriptor
   */
  set get(value) {
    (this.#desc || {}).get = value
  }

  /**
   * Getter around the `set` object descriptor property of
   * this instance of Descriptor.
   *
   * @returns {function} a function if the setter for this descriptor is
   * defined or `undefined` if the internal descriptor object or the setter
   * is undefined.
   */
  get set() {
    return this.#desc?.writable
  }

  /**
   * Sets the `set` value of this object. If the internal descriptor
   * store is invalid, the value is thrown away
   *
   * @param {function} value the setter function for this descriptor
   */
  set set(value) {
    (this.#desc || {}).set = value
  }

  [Symbol.for('nodejs.util.inspect.custom')](depth, options, inspect) {
    const type = this.isAccessor ? ' (Accessor)' : this.isData ? ' (Data)' : ''
    return `Descriptor${type} ${inspect(this.#desc, {...options, depth})}`
  }

  /**
   * Shorthand for Object.getOwnPropertyDescriptor()
   *
   * @param {object} object a non-null object instance
   * @param {string|symbol} key a symbol or string referencing which key on the
   * object to return a descriptor for.
   * @returns an object descriptor for the requested field or null
   */
  static for(object, key) {
    if (!isObject(object) && !isValidKey(key)) {
      return null
    }

    return Object.getOwnPropertyDescriptor(object, key)
  }

  /**
   * Take the descriptor defined by this objects values and apply them to
   * the specified object using the specified key.
   *
   * @param {object} object the object to apply this descriptor to
   * @param {string|symbol} forKey the string or symbol for which this
   * descriptor will abe applied
   */
  applyTo(object, forKey) {
    if (!isObject(object) || !isValidKey(forKey)) {
      throw new Error(`Cannot apply descriptor to non-object or invalid key`)
    }

    return Object.defineProperty(object, forKey, this.#desc)
  }

  /**
   * Converts this descriptor object into a base representation
   *
   * @param {string} hint one of `string`, `number` or default;
   * @returns if the hint is 'string', then a string identifying the enum
   * and its type is returned. `number` will always be NaN since it is incoret
   */
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'string':
        if (this.isAccessor) {
          const hasGetter = Reflect.has(this.#desc, 'get') ? `getter` : ''
          const hasSetter = Reflect.has(this.#desc, 'set') ? `setter` : ''
          const separator = hasGetter && hasSetter ? ', ' : ''

          return `Accessor (${hasGetter}${separator}${hasSetter})`
        }
        else if (this.isData) {
          const hasGetter = Reflect.has(this.#desc, 'value') ? `value` : ''
          const hasSetter = Reflect.has(this.#desc, 'writable') ? `writable` : ''
          const separator = hasGetter && hasSetter ? ', ' : ''

          return `Data (${hasGetter}${separator}${hasSetter})`
        }
        break

      case 'number':
        return NaN

      default:
        return this.#desc
    }
  }

  /**
   * Ensures that the constructor of this object instance's name
   * is returned if the string tag for this instance is queried
   *
   * @returns {string} the name of the class
   */
  get [Symbol.toStringTag]() {
    return this.constructor.name
  }

  /**
   * The function `getData` retrieves the value of a property from an object if it
   * exists and is a data property.
   *
   * @param object - The "object" parameter is the object from which we want to
   * retrieve data.
   * @param property - The `property` parameter is the name of the property that
   * you want to retrieve the data from.
   * @returns either the value of the specified property if it exists and is a data
   * property, or undefined if the property does not exist or is not a data
   * property.
   */
  static getData(object, property) {
    if (!isObject(object) || !isString(property)) {
      return null;
    }

    const descriptors = Descriptor.all(object)
    if (descriptors.has(property)) {
      const descriptor = descriptors.get(property)

      if (Descriptor.isData(descriptor)) {
        return descriptor.value
      }
    }

    return undefined
  }

  /**
   * The function `getAccessor` checks if an object has a getter/setter accessor
   * for a given property and returns the accessor functions if found.
   *
   * @param object - The `object` parameter is the object from which we want to
   * retrieve the accessor for a specific property.
   * @param property - The `property` parameter is the name of the property for
   * which we want to get the accessor.
   * @returns an object that contains the getter and setter functions for the
   * specified property of the given object. If the property is an accessor
   * property (defined with a getter and/or setter), the returned object will also
   * have additional properties such as "accessor" and "descriptor". If the
   * property is not found or is not an accessor property, the function returns
   * undefined.
   */
  static getAccessor(object, property) {
    if (!isObject(object))
    return null

    const [GETTER, SETTER, OBJECT] = [0, 1, 2]
    const results = [undefined, undefined, undefined]
    const descriptors = this.all(object)
    const isDescriptor = Descriptor.isDescriptor(object)

    if (descriptors.has(property) || isDescriptor) {
      const descriptor = isDescriptor ? object : descriptors.get(property)

      if (Descriptor.isAccessor(descriptor)) {
        results[OBJECT] = descriptors.object(property)
        results[GETTER] = descriptor?.get
        results[SETTER] = descriptor?.set

        Object.assign(results, {
          get() { this[GETTER].bind(this[OBJECT])() },
          set(value) { this[SETTER].bind(this[OBJECT])(value) },
          get accessor() { return true },
          get descriptor() { return descriptor },
          get boundDescriptor() {
            return {
              ...descriptor,
              get: descriptor.get?.bind(object),
              set: descriptor.set?.bind(object),
            }
          }
        })

        return results
      }
    }

    return undefined
  }

  /**
   * The function returns an object with enumerable and configurable properties
   * based on the input parameters.
   *
   * @param [enumerable=false] - A boolean value indicating whether the property
   * can be enumerated (listed) when iterating over the object's properties.
   * @param [configurable=false] - The `configurable` parameter determines whether
   * the property can be deleted or its attributes can be modified. If
   * `configurable` is set to `true`, the property can be deleted and its
   * attributes can be changed. If `configurable` is set to `false`, the property
   * cannot be deleted and
   * @returns An object with the properties `enumerable` and `configurable` is
   * being returned. The values of these properties are determined by the arguments
   * passed to the `base` function.
   */
  static base(enumerable = false, configurable = false) {
    return {
      enumerable,
      configurable
    }
  }

  /**
   * The function "newAccessor" creates a new property descriptor object with a
   * getter and setter function, along with optional enumerable and configurable
   * flags.
   *
   * @param getter - The getter parameter is a function that will be used as the
   * getter for the property. It will be called when the property is accessed.
   * @param setter - The `setter` parameter is a function that will be used as the
   * setter for the property. It will be called whenever the property is assigned a
   * new value.
   * @param [] - - `getter`: A function that will be used as the getter for the
   * property.
   * @returns an object with properties "get", "set", "enumerable", and
   * "configurable".
   */
  static accessor(
    getter,
    setter,
    { enumerable, configurable } = Descriptor.base()
  ) {
    return {
      get: getter,
      set: setter,
      enumerable,
      configurable
    }
  }

  /**
   * The function "newData" creates a new data object with customizable properties.
   *
   * @param value - The value parameter represents the value that will be assigned
   * to the property.
   * @param [writable=true] - The `writable` parameter determines whether the value
   * of the property can be changed. If `writable` is set to `true`, the value can
   * be changed. If `writable` is set to `false`, the value cannot be changed.
   * @param [] - - `value`: The value to be assigned to the property.
   * @returns an object with properties `value`, `enumerable`, `writable`, and
   * `configurable`.
   */
  static data(
    value,
    writable = true,
    { enumerable, configurable } = Descriptor.base()
  ) {
    return {
      value,
      enumerable,
      writable,
      configurable
    }
  }

  /**
   * The function checks if an object is a valid object descriptor in JavaScript.
   *
   * @param object - The `object` parameter is the object that we want to check if
   * it is a descriptor.
   * @returns a boolean value.
   */
  static isDescriptor(object) {
    const knownKeys = [
      ...Descriptor.SHARED_KEYS,
      ...Descriptor.ACCESSOR_KEYS,
      ...Descriptor.DATA_KEYS,
    ]

    return hasSome(object, knownKeys)
  }

  /**
   * The function checks if a given property or descriptor is a data property.
   *
   * @param descriptor_orProp - The `descriptor_orProp` parameter can be either a
   * descriptor or a property name.
   * @param object - The `object` parameter is the object that you want to check
   * for data properties.
   * @returns a boolean value. It returns `true` if the `descriptor` object has any
   * keys that match the `DATA_KEYS` array, otherwise it returns `false`.
   */
  static isData(object_orProp, property) {
    const needsDescriptor = (
      ((typeof object_orProp === 'object') || object_orProp instanceof Object) &&
      property instanceof String
    )

    const descriptor = (needsDescriptor
      ? Descriptor.for(object_orProp, property)
      : object_orProp
    )

    const { ACCESSOR_KEYS, DATA_KEYS } = this
    let validData = false

    if (hasSome(descriptor, ACCESSOR_KEYS)) {
      validData = false
    }
    else if (hasSome(descriptor, DATA_KEYS)) {
      validData = true
    }

    return validData
  }

  /**
   * The function checks if a given property descriptor or property of an object is
   * an accessor.
   *
   * @param object_orProp - The `descriptor_orProp` parameter can be either a
   * descriptor object or a property name.
   * @param property - The `object` parameter is the object that you want to check
   * for accessor properties.
   * @returns a boolean value. It returns true if the descriptor or property passed
   * as an argument is an accessor descriptor, and false otherwise.
   */
  static isAccessor(object_orProp, property) {
    const needsDescriptor = (
      (object_orProp && property) &&
      ((typeof object_orProp === 'object') || object_orProp instanceof Object) &&
      (property instanceof String || (typeof property === 'symbol'))
    )

    const descriptor = (needsDescriptor
      ? Descriptor.for(object_orProp, property)
      : object_orProp)

    const { ACCESSOR_KEYS, DATA_KEYS } = this
    let validAccessor = false

    if (hasSome(descriptor, DATA_KEYS)) {
      validAccessor = false
    }
    else if (hasSome(descriptor, ACCESSOR_KEYS)) {
      validAccessor = true
    }

    return validAccessor
  }

  /**
   * A base descriptor (new for each read) that is both enumerable and configurable
   *
   * @returns The method `flexible` is returning the result of calling the `base`
   * method with the arguments `true` and `true`.
   */
  static get flexible() {
    return this.base(true, true)
  }

  /**
   * A base descriptor (new for each read) that is not enumerable but is configurable
   *
   * @returns The method `enigmatic` is returning the result of calling the `base`
   * method with the arguments `false` and `true`.
   */
  static get enigmatic() {
    return this.base(false, true)
  }

  /**
   * A base descriptor (new for each read) that is neither enumerable nor configurable
   *
   * @returns The code is returning the result of calling the `base` method with
   * the arguments `false` and `false`.
   */
  static get intrinsic() {
    return this.base(false, false)
  }

  /**
   * A base descriptor (new for each read) that enumerable but not configurable
   *
   * @returns The method is returning the result of calling the `base` method with
   * the arguments `true` and `false`.
   */
  static get transparent() {
    return this.base(true, false)
  }

  /**
   * The function returns an array of shared descriptor keys.
   *
   * @returns An array containing the strings 'configurable' and 'enumerable'.
   */
  static get SHARED_KEYS() {
    return ['configurable', 'enumerable']
  }

  /**
   * The function returns an array of accessor descriptor keys.
   *
   * @returns An array containing the strings 'get' and 'set' is being returned.
   */
  static get ACCESSOR_KEYS() {
    return ['get', 'set']
  }

  /**
   * The function returns an array of data descriptor keys.
   *
   * @returns An array containing the strings 'value' and 'writable' is being
   * returned.
   */
  static get DATA_KEYS() {
    return ['value', 'writable']
  }
}

export const DescriptorExtensions = new Extension(Descriptor)