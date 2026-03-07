var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/index.js
var index_exports = {};
__export(index_exports, {
  COPropertyHandler: () => COPropertyHandler,
  DescriptorUtils: () => DescriptorUtils,
  FlexiblyHiddenHandler: () => FlexiblyHiddenHandler,
  FlexiblyVisibleHandler: () => FlexiblyVisibleHandler,
  ImmutablyHiddenHandler: () => ImmutablyHiddenHandler,
  ImmutablyVisibleHandler: () => ImmutablyVisibleHandler,
  MutablyHiddenHandler: () => MutablyHiddenHandler,
  MutablyVisibleHandler: () => MutablyVisibleHandler,
  SC: () => SC,
  StdoutGlobalPatches: () => StdoutGlobalPatches,
  StringConsole: () => StringConsole,
  StringConsoleExtension: () => StringConsoleExtension,
  VisibilityKeys: () => VisibilityKeys,
  VisibilityScopeHandler: () => VisibilityScopeHandler,
  accessor: () => accessor,
  as: () => as,
  captureStdout: () => captureStdout,
  copyObject: () => copyObject,
  createToolkit: () => createToolkit,
  customCopyObject: () => customCopyObject,
  data: () => data,
  default: () => index_default,
  describe: () => describe,
  describeMany: () => describeMany,
  extract: () => extract,
  has: () => has,
  is: () => is,
  isAccessor: () => isAccessor,
  isData: () => isData,
  isDescriptor: () => isDescriptor,
  kAccessorDescriptorKeys: () => kAccessorDescriptorKeys,
  kDataDescriptorKeys: () => kDataDescriptorKeys,
  kDescriptorKeys: () => kDescriptorKeys,
  kSharedDescriptorKeys: () => kSharedDescriptorKeys,
  kVisibilityKeys: () => kVisibilityKeys,
  makeTransducer: () => makeTransducer,
  redescribe: () => redescribe,
  si: () => si,
  transduceFrom: () => transduceFrom,
  transduceFromCOHandler: () => transduceFromCOHandler,
  tryIgnore: () => tryIgnore
});
module.exports = __toCommonJS(index_exports);

// src/utils/copy.object.js
function tryIgnore(code) {
  try {
    return code();
  } catch (ignore) {
    return void 0;
  }
}
function transduceFrom(array, transform, into = {}) {
  if (typeof transform !== "function") {
    return into;
  }
  return array.reduce((accumulator, element) => {
    const { key, value } = transform?.(element) ?? {};
    if (key && value) {
      accumulator[key] = value;
    }
    return accumulator;
  }, into);
}
function transduceFromCOHandler(element) {
  const result = {};
  if (element instanceof COPropertyHandler) {
    result.key = element.property;
    result.value = element;
  }
  return result;
}
function makeTransducer(array, transform) {
  return transduceFrom.bind(null, array, transform);
}
var COPropertyHandler = class _COPropertyHandler {
  /**
   * The name of the property this handler is responsible for.
   * @type {string|undefined}
   */
  property = void 0;
  /**
   * The property handler. When provided and invoked, it will receive
   * a the property name of the value being handled, the current
   * descriptor to transform, and the object into which values are
   * currently being copied into.
   *
   * The result must be a COPropertyHandler response type, which can
   * be made with {@link COPropertyHandler.makeResponse} and which
   * can be validated with {@link COPropertyHandler.isResponse}.
   *
   * The handler should have the following parameters
   *  - {string} property - The name of the property being handled.
   *  - {Object} curDescriptor - The property descriptor to handle.
   *  - {Object} destination - The destination object into which
   *    properties are being copied.
   *
   * An should return
   *  - {Object} a `COPropertyHandler.Response` type object which
   *    can be made with {@link COPropertyHandler.makeResponse}.
   *
   * @type {function|undefined}
   */
  handler = void 0;
  /**
   * Creates a new COPropertyHandler instance.
   * @param {string} [property] - The name of the property to handle.
   * @param {function} [handler] - The function to handle the property
   * descriptor.
   */
  constructor(property2, handler) {
    Object.assign(this, { property: property2, handler });
  }
  /**
   * Handles a property descriptor using the registered handler function.
   * @param {string} property - The name of the property being handled.
   * @param {Object} descriptor - The property descriptor to handle.
   * @returns {Object} The resulting property descriptor after handling.
   */
  handle(property2, descriptor, destination) {
    if (this.handler) {
      return _COPropertyHandler.defaultHandle(
        property2,
        descriptor,
        this.handler
      );
    }
    return descriptor;
  }
  /**
   * The default property descriptor handler.
   *
   * @param {string} property - The name of the property being handled.
   * @param {Object} curDescriptor - The property descriptor to handle.
   * @param {Object} destination - The destination object into which
   * properties are being copied.
   * @param {function} handler - The function to handle the property
   * descriptor.
   * @returns {Object} a `COPropertyHandler.Response` type object which
   * can be made with {@link COPropertyHandler.makeResponse}.
   */
  static defaultHandle(property2, curDescriptor, destination, handler) {
    if (typeof handler === "function") {
      try {
        const {
          descriptor,
          flow
        } = handler(property2, curDescriptor, destination);
        return this.makeResponse(descriptor, flow);
      } catch (ignore) {
      }
    }
    return this.makeResponse(curDescriptor);
  }
  /**
   * Creates a COPropertyHandler response object.
   *
   * @param {Object} descriptor - The property descriptor.
   * @param {string} [flow=COPropertyHandler.kNoChange] - The flow control
   * directive. Must be one of the values from
   * {@link COPropertyHandler.flowTypes} if provided.
   * @returns {COPropertyHandler.Response} The response object.
   * @example
   * COPropertyHandler.makeResponse({ value: 42, writable: false })
   * // => {
   * //   newDescriptor: { value: 42, writable: false },
   * //   flow: 'nochange'
   * // }
   */
  static makeResponse(descriptor, flow) {
    return {
      newDescriptor: descriptor,
      flow: flow ?? this.kNoChange,
      get [Symbol.toStringTag]() {
        return "COPropertyHandler.Response";
      }
    };
  }
  /**
   * Checks if a value is a valid COPropertyHandler response object.
   * @param {*} value - The value to check.
   * @returns {boolean} `true` if the value is a response object, `false`
   * otherwise.
   * @example
   * COPropertyHandler.isResponse({
   *   newDescriptor: { value: 42 },
   *   flow: 'nochange'
   * })
   * // => true
   */
  static isResponse(value) {
    return value && typeof value === "object" && value[Symbol.toStringTag] === "COPropertyHandler.Response";
  }
  /**
   * The flow control directive indicating no change in flow.
   * @type {string}
   */
  static get kNoChange() {
    return "nochange";
  }
  /**
   * The flow control directive indicating to continue the loop.
   * @type {string}
   */
  static get kContinue() {
    return "continue";
  }
  /**
   * The flow control directive indicating to break the loop.
   * @type {string}
   */
  static get kBreak() {
    return "break";
  }
  /**
   * An array of all valid flow control directive values.
   * @type {string[]}
   */
  static get flowTypes() {
    return [this.kNoChange, this.kContinue, this.kBreak];
  }
  /**
   * An object mapping flow control directive values to their
   * corresponding string representations.
   * @type {Object.<string, string>}
   */
  static get flowEnum() {
    return {
      [this.kNoChange]: this.kNoChange,
      [this.kContinue]: this.kContinue,
      [this.kBreak]: this.kBreak
    };
  }
};
function kVisibilityKeys() {
  const keys = {
    get mutablyHidden() {
      return Symbol.for(JSON.stringify({
        enumerable: false,
        configurable: true
      }));
    },
    get mutablyVisible() {
      return Symbol.for(JSON.stringify({
        enumerable: true,
        configurable: true
      }));
    },
    get immutablyHidden() {
      return Symbol.for(JSON.stringify({
        enumerable: false,
        configurable: false
      }));
    },
    get immutablyVisible() {
      return Symbol.for(JSON.stringify({
        enumerable: true,
        configurable: false
      }));
    },
    get flexiblyHidden() {
      return Symbol.for(JSON.stringify({
        enumerable: false,
        configurable: false,
        writable: true
      }));
    },
    get flexiblyVisible() {
      return Symbol.for(JSON.stringify({
        enumerable: true,
        configurable: false,
        writable: true
      }));
    }
  };
  const enumerated = {
    mutablyHidden: keys.mutablyHidden,
    mutablyVisible: keys.mutablyVisible,
    immutablyHidden: keys.immutablyHidden,
    immutablyVisible: keys.immutablyVisible,
    flexiblyHidden: keys.flexiblyHidden,
    flexiblyVisible: keys.flexiblyVisible
  };
  function* keyGenerator() {
    for (const key of Object.keys(enumerated)) {
      yield key;
    }
  }
  function* symbolGenerator() {
    for (const value of Object.values(enumerated)) {
      yield value;
    }
  }
  function* entryGenerator() {
    for (const entry of Object.entries(enumerated)) {
      yield entry;
    }
  }
  function* descriptorGenertor() {
    for (const [key, value] of entryGenerator()) {
      yield [key, JSON.parse(value.description)];
    }
  }
  Object.defineProperties(keys, {
    enumeration: { get() {
      return enumerated;
    }, enumerable: false },
    keys: { get() {
      return keyGenerator();
    }, enumerable: false },
    symbols: { get() {
      return symbolGenerator();
    }, enumerable: false },
    entries: { get() {
      return entryGenerator();
    }, enumerable: false },
    descriptors: { get() {
      return descriptorGenertor();
    }, enumerable: false },
    descriptorFor: {
      value(symbol) {
        try {
          return JSON.parse(symbol.description);
        } catch (ignored) {
        }
        return void 0;
      },
      enumerable: false
    },
    [Symbol.iterator]: { get() {
      return symbolGenerator();
    } }
  });
  return keys;
}
var VisibilityKeys = kVisibilityKeys();
var VisibilityScopeHandler = class extends COPropertyHandler {
  overrides = void 0;
  /**
   * Creates a new VisibilityScopeHandler instance.
   *
   * @constructor
   * @param {symbol} visibilityKey - The visibility key to use for handling
   *   property descriptors.
   */
  constructor(visibilityKey) {
    super(visibilityKey, (property2, descriptor, dest, source) => {
      let data2 = descriptor?.value;
      if (!descriptor || typeof descriptor.value !== "object") {
        return COPropertyHandler.makeResponse(descriptor, "nochange");
      }
      if (!data2 && (descriptor?.get || descriptor?.set)) {
        const newDescriptor = this.applyOverridesTo(descriptor);
        return COPropertyHandler.makeResponse(newDescriptor, "nochange");
      }
      data2 = customCopyObject({ deep: false }, {}, data2 ?? {});
      this.walkAndApply(data2);
      descriptor.value = data2;
      return COPropertyHandler.makeResponse(descriptor, "continue");
    });
    tryIgnore(() => this.overrides = JSON.parse(property.description));
  }
  applyOverridesTo(existingDescriptor, overwrite = false) {
    const allowed = ["value", "get", "set", "writable", "configurable", "enumerable"];
    const output = overwrite ? existingDescriptor : { ...existingDescriptor };
    for (let [key, value] of Object.entries(this.overrides ?? {})) {
      if (!~allowed.indexOf(key)) {
        continue;
      }
      if (!(["get", "set"].some((k) => k === key) && ["undefined", "function"].some((t) => typeof value === t))) {
        continue;
      }
      if (!(["enumerable", "configurable", "writable"].some((k) => k === key) && typeof value !== "boolean")) {
        value = !!value;
      }
      delete output[key];
      output[key] = value;
    }
    return output;
  }
  walkAndApply(to) {
    Reflect.ownKeys(to).forEach((key) => {
      tryIgnore(() => {
        let result = Object.getOwnPropertyDescriptor(to, key);
        this.applyOverridesTo(result, true);
        Object.defineProperty(to, key, result);
      });
    });
  }
};
var MutablyVisibleHandler = class extends VisibilityScopeHandler {
  constructor() {
    super(VisibilityKeys.mutablyVisible);
  }
  static get shared() {
    return this.#singleton ?? (this.#singleton = new this());
  }
  static #singleton;
};
var MutablyHiddenHandler = class extends VisibilityScopeHandler {
  constructor() {
    super(VisibilityKeys.mutablyHidden);
  }
  static get shared() {
    return this.#singleton ?? (this.#singleton = new this());
  }
  static #singleton;
};
var ImmutablyVisibleHandler = class extends VisibilityScopeHandler {
  constructor() {
    super(VisibilityKeys.immutablyVisible);
  }
  static get shared() {
    return this.#singleton ?? (this.#singleton = new this());
  }
  static #singleton;
};
var ImmutablyHiddenHandler = class extends VisibilityScopeHandler {
  constructor() {
    super(VisibilityKeys.immutablyHidden);
  }
  static get shared() {
    return this.#singleton ?? (this.#singleton = new this());
  }
  static #singleton;
};
var FlexiblyVisibleHandler = class extends VisibilityScopeHandler {
  constructor() {
    super(VisibilityKeys.flexiblyVisible);
  }
  static get shared() {
    return this.#singleton ?? (this.#singleton = new this());
  }
  static #singleton;
};
var FlexiblyHiddenHandler = class extends VisibilityScopeHandler {
  constructor() {
    super(VisibilityKeys.flexiblyHidden);
  }
  static get shared() {
    return this.#singleton ?? (this.#singleton = new this());
  }
  static #singleton;
};
Object.defineProperties(COPropertyHandler, {
  MutablyHiddenHandler: { get() {
    return MutablyHiddenHandler.shared;
  } },
  MutablyVisibleHandler: { get() {
    return MutablyVisibleHandler.shared;
  } },
  ImmutablyHiddenHandler: { get() {
    return ImmutablyHiddenHandler.shared;
  } },
  ImmutablyVisibleHandler: { get() {
    return ImmutablyVisibleHandler.shared;
  } },
  FlexiblyHiddenHandler: { get() {
    return FlexiblyHiddenHandler.shared;
  } },
  FlexiblyVisibleHandler: { get() {
    return FlexiblyVisibleHandler.shared;
  } },
  handlers: {
    value: [
      MutablyHiddenHandler,
      MutablyVisibleHandler,
      ImmutablyHiddenHandler,
      ImmutablyVisibleHandler,
      FlexiblyHiddenHandler,
      FlexiblyVisibleHandler
    ].map((klass) => klass.shared),
    configurable: true,
    enumerable: true
  }
});
function copyObject(deep, destination, ...sources) {
  const options = {
    deep: deep || false,
    propertyHandlers: COPropertyHandler?.handlers ?? []
  };
  return customCopyObject(options, destination, ...sources);
}
function customCopyObject(_options, _destination, ..._sources) {
  const visited = /* @__PURE__ */ new Set();
  const [options, destination, sources] = ccoParseArgs(
    _options,
    _destination,
    ..._sources
  );
  let { deep } = options;
  for (const source of sources) {
    if (source === null || typeof source !== "object" || visited.has(source)) {
      continue;
    }
    visited.add(source);
    const keys = Reflect.ownKeys(source);
    for (let key of keys) {
      let descriptor;
      try {
        descriptor = Object.getOwnPropertyDescriptor(source, key);
      } catch (err) {
        console.warn(`Failed to get descriptor for key "${key}": ${err}`);
        continue;
      }
      const isDataDesc = Reflect.has(descriptor, "value");
      const keyedValue = descriptor?.value;
      const conditionsMet = [
        isDataDesc,
        keyedValue,
        typeof keyedValue === "object",
        !visited.has(keyedValue)
      ].every((condition) => condition);
      if (conditionsMet) {
        visited.add(keyedValue);
        const prototype = Object.getPrototypeOf(keyedValue);
        const descriptors = Object.getOwnPropertyDescriptors(keyedValue);
        const replacement = Object.create(prototype, descriptors);
        descriptor.value = deep ? customCopyObject(options, replacement, keyedValue) : replacement;
      }
      try {
        Object.defineProperty(destination, key, descriptor);
      } catch (err) {
        console.error(`Failed to define property "${key}": ${err}`);
      }
    }
  }
  return destination;
}
function ccoParseArgs(options, destination, ...sources) {
  let { deep = true, propertyHandlers = [] } = options;
  deep = !!deep;
  propertyHandlers = (Array.isArray(propertyHandlers) ? propertyHandlers : [propertyHandlers]).filter((element) => element instanceof COPropertyHandler);
  const transducer = makeTransducer(propertyHandlers, transduceFromCOHandler);
  propertyHandlers = transducer({});
  options = { deep, propertyHandlers };
  sources = sources.filter((source) => source && typeof source === "object");
  if (!destination) {
    destination = {};
  }
  return [options, destination, sources];
}

// src/utils/stdout.js
var import_extension = require("@nejs/extension");
var hasProcess = typeof process !== "undefined" && process?.stdout?.write && process?.stderr?.write;
function captureStdout(callback, args = [], thisArg = console) {
  let captured = "";
  const originalWrite = hasProcess ? process.stdout.write : null;
  if (typeof callback !== "function") {
    let newArgs = [callback];
    if (thisArg) {
      newArgs.push(thisArg);
    }
    newArgs = newArgs.concat(args);
    callback = function() {
      console.log(...newArgs);
    };
    thisArg = console;
    args = [];
  }
  if (hasProcess) {
    process.stdout.write = (chunk, encoding, callback2) => {
      captured += chunk;
    };
  }
  try {
    callback.apply(thisArg, args);
  } finally {
    if (hasProcess) {
      process.stdout.write = originalWrite;
    }
  }
  return captured.substring(0, captured.length - 1);
}
var StringConsole = class _StringConsole {
  /**
   * @type {Array}
   * @description
   * The buffer array is used to store captured console output. It is
   * initialized as an empty array and can be populated with strings
   * representing console messages. This buffer serves as a temporary
   * storage for output that can be manipulated or inspected later.
   *
   * @example
   * const console = new StringConsole()
   * console.buffer.push('Hello, World!')
   * console.buffer // ['Hello, World!']
   */
  buffer = [];
  /**
   * The last index of the buffer when capture began. This number should be
   * set to `NaN` when not in use.
   *
   * @type {number|NaN}
   */
  capturedAt = NaN;
  /**
   * If this is `true`, all "logged" output will be captured in an ever
   * growing buffer.
   *
   * @type {boolean}
   * @see {@link StringConsole.buffer}
   */
  captureOutput = true;
  /**
   * @typedef {
   *   Int8Array|Int16Array|Int32Array|Float32Array|Float64Array
   * } TypedArray
   */
  /**
   * @typedef {(
   *   chunk: string|Buffer|TypedArray|DataView,
   *   encoding: string|null,
   *   callback: ()=>{}
   * )=>boolean} StringConsoleRecorder
   * @property {boolean} [Symbol.for('StringConsole.recorder')]
   */
  /**
   * The recorder function is what is subsituted for the `process.stdout.write`
   * function whenever we need to temporarily capture the output of data bound
   * for the bidirectional read-write stream, `stdout`.
   *
   * @type {StringConsoleRecorder}
   * @param {string|Buffer|TypedArray|DataView|any} chunk Optional data to
   * write. For streams not operating in object mode, chunk must be a
   * {@link String}, {@link Buffer}, {@link Int8Array}, {@link Int16Array},
   * {@link Int32Array}, {@link Float32Array}, {@link Float64Array} or
   * {@link DataView}. For object mode streams, chunk may be any JavaScript
   * value other than `null`.
   * @param {string|null} encoding the encoding, if chunk is a string.
   * Default: `'utf8'`
   * @param {Function} callback callback for when this chunk of data is
   * flushed.
   *
   * @returns {boolean} false if the stream wishes for the calling code to
   * wait for the 'drain' event to be emitted before continuing to write
   * additional data; otherwise true.
   */
  recorder = Object.defineProperty(
    function recorder(chunk, encoding, callback) {
      this.buffer.push(chunk);
    },
    Symbol.for(`StringConsole.recorder`),
    { value: true, configurable: true }
  );
  /**
   * Initializes a new instance of the StringConsole class.
   *
   * @param {string|string[]} [initialContents] - The initial contents to
   * populate the buffer. If an array is provided, it will be used directly
   * as the buffer. If a single string is provided, it will be converted
   * to a string and added to the buffer.
   *
   * @example
   * const console1 = new StringConsole('Hello')
   * console1.buffer // ['Hello']
   *
   * const console2 = new StringConsole(['Hello', 'World'])
   * console2.buffer // ['Hello', 'World']
   */
  constructor(captureOutput = true, initialContents = void 0) {
    this.recorder = this.recorder.bind(this);
    if (Array.isArray(initialContents))
      this.buffer = initialContents;
    else if (initialContents)
      this.buffer.push(String(initialContents));
  }
  /**
   * Clears the buffer by removing all elements.
   *
   * This method utilizes the `splice` function to remove all elements
   * from the buffer array, effectively resetting it to an empty state.
   * This is useful when you want to discard all previously captured
   * console output and start fresh.
   *
   * @returns {StringConsole} `this` to allow for calling `clear()`
   * before immediately invoking a console method.
   *
   * @example
   * const console = new StringConsole(['Hello', 'World'])
   * console.clear()
   * console.buffer // []
   */
  clear() {
    this.buffer.splice(0, this.buffer.length);
    return this;
  }
  /**
   * Checks if the console output is currently being captured.
   *
   * This method determines if the `process.stdout.write` function has been
   * overridden to capture console output by checking for the presence of
   * a specific symbol.
   *
   * @returns {boolean} True if capturing is active, false otherwise.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.startCapture()
   * console.log(stringConsole.isCapturing()) // Stores 'true' in the buffer
   */
  isCapturing() {
    if (!hasProcess) return false;
    return Reflect.has(
      process.stdout.write,
      Symbol.for("StringConsole.recorder")
    );
  }
  /**
   * Starts capturing console output.
   *
   * This method overrides the `process.stdout.write` function with a custom
   * recorder function to capture all console output.
   *
   * @returns {number} the last index of the buffer in its current state or
   * 0 if it is empty
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.startCapture()
   * console.log('This will be stored in stringConsole.buffer')
   */
  startCapture() {
    if (this.captureOutput === false)
      this.buffer = [];
    if (hasProcess) {
      process.stdout.write = this.recorder;
      process.stderr.write = this.recorder;
    }
    this.capturedAt = this.buffer.length ? this.buffer.length : 0;
    return this.capturedAt;
  }
  /**
   * An object containing two properties covering the captured content
   * while `process.stdout.write` was swapped. It should contain the
   * range of line indicies as well as the content as an array of strings
   *
   * @typedef {object} StringConsoleCapturedOutput
   * @property {number[]} range an array of two numbers, a starting index
   * and an ending index. This value will be [NaN,NaN] if this instance
   * has indicated that storing captured output is disabled.
   * @property {string[]} lines an array of strings of captured output
   * that occurred in between calls to {@link ~startCapture} and then
   * ending call to {@link ~stopCapture}
   */
  /**
   * Stops capturing console output.
   *
   * This method restores the original `process.stdout.write` function,
   * ceasing the capture of console output.
   *
   * @returns {StringConsoleCapturedOutput} the range of indices capturing
   * the lines of the buffer that have been added since capturing was
   * started.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.startCapture()
   * console.log('This will be stored in stringConsole.buffer')
   * stringConsole.stopCapture()
   * console.log('This will not be captured')
   */
  stopCapture() {
    const range = [this.capturedAt || 0, this.buffer.length - 1];
    const lines = this.buffer.slice(range[0], range[1] + 1);
    if (this.captureOutput === false)
      this.buffer = [];
    if (hasProcess) {
      process.stdout.write = _StringConsole[Symbol.for("process.stdout.write")];
      process.stderr.write = _StringConsole[Symbol.for("process.stderr.write")];
    }
    this.capturedAt = NaN;
    return { range, lines };
  }
  /**
   * Joins the StringConsole output as a single string. By default, each entry
   * captured so far is joined on a new line. Pass a different joiner such as
   * an empty string or a whitespace character, as examples, to change the
   * output string.
   *
   * @param {string} joinOn the string to join the output buffer on, defaults
   * to a new line character
   * @returns a single string of contatenated entries so far to this buffer.
   */
  toString(joinOn = "") {
    return this.buffer.join(joinOn);
  }
  /**
   * Captures formatted debug messages as though they'd been printed. The
   * resulting output that would have been printed is stored in the buffer
   * as well as being returned.
   *
   * This method formats the provided arguments with color coding specific
   * to the 'debug' level as though `console.debug` were used. The output
   * is captured and stored in the buffer for later inspection, but not
   * actually printed to the standard output.
   *
   * @param {any[]} args - The arguments to be log captured. These can be
   * of any type and will be formatted with color coding without being logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.debug('[debug]', 'message')
   * stringConsole.buffer // Contains the captured messages so far as an array
   */
  debug(...args) {
    args = this.constructor.colorArgs("debug", args);
    this.startCapture();
    console.debug(...args);
    return this.stopCapture().lines.join("\n");
  }
  /**
   * Captures formatted error messages as though they'd been printed. The
   * resulting output that would have been printed is stored in the buffer
   * as well as being returned.
   *
   * This method formats the provided arguments with color coding specific
   * to the 'error' level as though `console.error` were used. The output
   * is captured and stored in the buffer for later inspection, but not
   * actually printed to the standard output.
   *
   * @param {any[]} args - The arguments to be log captured. These can be
   * of any type and will be formatted with color coding without being logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.error('[error]', 'message')
   * stringConsole.buffer // Contains the captured messages so far as an array
   */
  error(...args) {
    args = this.constructor.colorArgs("error", args);
    this.startCapture();
    console.error(...args);
    return this.stopCapture().lines.join("\n");
  }
  /**
   * Groups console output under a specified group name and captures the
   * output. No content will actually be logged to the console, just
   * the output that normally would be is formatted in a string and returned
   * instead.
   *
   * This method allows you to format multiple messages under a single
   * group name. It captures the output of each invocation and stores it in
   * a buffer. The captured output is returned as a single string.
   *
   * @param {string} groupName - The name of the group under which the
   * messages will be logged.
   * @param {...Array} invocations - An array of invocations where each
   * invocation is an array. The first element is the log level (e.g.,
   * 'log', 'info'), and the remaining elements are the arguments to be
   * logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const console = new StringConsole()
   * const output = console.group('MyGroup',
   *   ['log', 'Hello'],
   *   ['warn', 'Warning!']
   * )
   *
   * console.buffer // Contains the captured group output
   */
  group(groupName, ...invocations) {
    const commands = ["log", "info", "warn", "error", "debug", "trace"];
    const buffer = [];
    invocations = invocations.filter((i) => commands.includes(i?.[0]));
    if (groupName)
      groupName = this.constructor.style(groupName, ["underline", "bold"]);
    else
      groupName = this.constructor.style("grouped", ["underline", "bold"]);
    this.startCapture();
    console.group(groupName);
    for (const invocation of invocations) {
      if (!Array.isArray(invocation) || invocation.length < 2)
        continue;
      const [level, ...args] = invocation;
      console[level](...this.constructor.colorArgs(level, args));
    }
    console.groupEnd(groupName);
    return this.stopCapture().lines.join("");
  }
  /**
   * Captures formatted info messages as though they'd been printed. The
   * resulting output that would have been printed is stored in the buffer
   * as well as being returned.
   *
   * This method formats the provided arguments with color coding specific
   * to the 'info' level as though `console.info` were used. The output
   * is captured and stored in the buffer for later inspection, but not
   * actually printed to the standard output.
   *
   * @param {any[]} args - The arguments to be log captured. These can be
   * of any type and will be formatted with color coding without being logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.info('[info]', 'message')
   * stringConsole.buffer // Contains the captured messages so far as an array
   */
  info(...args) {
    args = this.constructor.colorArgs("info", args);
    this.startCapture();
    console.info(...args);
    return this.stopCapture().lines.join("\n");
  }
  /**
   * Captures formatted log messages as though they'd been printed. The
   * resulting output that would have been printed is stored in the buffer
   * as well as being returned.
   *
   * This method formats the provided arguments with color coding specific
   * to the 'log' level as though `console.log` were used. The output
   * is captured and stored in the buffer for later inspection, but not
   * actually printed to the standard output.
   *
   * @param {any[]} args - The arguments to be log captured. These can be
   * of any type and will be formatted with color coding without being logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.log('[log]', 'message')
   * stringConsole.buffer // Contains the captured messages so far as an array
   */
  log(...args) {
    args = this.constructor.colorArgs("log", args);
    this.startCapture();
    console.log(...args);
    return this.stopCapture().lines.join("\n");
  }
  /**
   * Captures formatted trace messages as though they'd been printed. The
   * resulting output that would have been printed is stored in the buffer
   * as well as being returned.
   *
   * This method formats the provided arguments with color coding specific
   * to the 'trace' level as though `console.trace` were used. The output
   * is captured and stored in the buffer for later inspection, but not
   * actually printed to the standard output.
   *
   * @param {any[]} args - The arguments to be log captured. These can be
   * of any type and will be formatted with color coding without being logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.trace('[trace]', 'message')
   * stringConsole.buffer // Contains the captured messages so far as an array
   */
  trace(...args) {
    args = this.constructor.colorArgs("trace", args);
    this.startCapture();
    console.trace(...args);
    return this.stopCapture().lines.join("\n");
  }
  /**
   * Captures formatted warn messages as though they'd been printed. The
   * resulting output that would have been printed is stored in the buffer
   * as well as being returned.
   *
   * This method formats the provided arguments with color coding specific
   * to the 'warn' level as though `console.warn` were used. The output
   * is captured and stored in the buffer for later inspection, but not
   * actually printed to the standard output.
   *
   * @param {any[]} args - The arguments to be log captured. These can be
   * of any type and will be formatted with color coding without being logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const stringConsole = new StringConsole()
   * stringConsole.warn('[warn]', 'message')
   * stringConsole.buffer // Contains the captured messages so far as an array
   */
  warn(...args) {
    args = this.constructor.colorArgs("warn", args);
    this.startCapture();
    console.warn(...args);
    return this.stopCapture().lines.join("\n");
  }
  /**
   * Captures a single line of text that would be logged to the console if
   * the console function of the same name were to be invoked. The string
   * is formatted according to the log colors, or any pre-existing colors as
   * those are untouched. After formatting, the string is returned.
   *
   * @param {...*} args the arguments to be logged. These can be of any
   *   type and will be passed to the underlying console's method of the same
   *   name.
   *
   * @returns {string}
   *
   * @example
   * const string = StringConsole.debug('[debug]: %o', someVariable)
   */
  static debug(...args) {
    return this.#console.clear().debug(...args);
  }
  /**
   * Captures a single line of text that would be logged to the console if
   * the console function of the same name were to be invoked. The string
   * is formatted according to the log colors, or any pre-existing colors as
   * those are untouched. After formatting, the string is returned.
   *
   * @param {...*} args the arguments to be logged. These can be of any
   *   type and will be passed to the underlying console's method of the same
   *   name.
   *
   * @returns {string}
   *
   * @example
   * const string = StringConsole.error('[error]: %o', someVariable)
   */
  static error(...args) {
    return this.#console.clear().error(...args);
  }
  /**
   * Groups console output under a specified group name and captures the
   * output. No content will actually be logged to the console, just
   * the output that normally would be is formatted in a string and returned
   * instead.
   *
   * This method allows you to format multiple messages under a single
   * group name. It captures the output of each invocation and stores it in
   * a buffer. The captured output is returned as a single string.
   *
   * @param {string} groupName - The name of the group under which the
   * messages will be logged.
   * @param {...Array} invocations - An array of invocations where each
   * invocation is an array. The first element is the log level (e.g.,
   * 'log', 'info'), and the remaining elements are the arguments to be
   * logged.
   *
   * @returns {string} The captured console output as a string.
   *
   * @example
   * const console = new StringConsole()
   * const output = console.group('MyGroup',
   *   ['log', 'Hello'],
   *   ['warn', 'Warning!']
   * )
   *
   * console.buffer // Contains the captured group output
   */
  static group(groupName, ...invocations) {
    return this.#console.clear().group(groupName, ...invocations);
  }
  /**
   * Captures a single line of text that would be logged to the console if
   * the console function of the same name were to be invoked. The string
   * is formatted according to the log colors, or any pre-existing colors as
   * those are untouched. After formatting, the string is returned.
   *
   * @param {...*} args the arguments to be logged. These can be of any
   *   type and will be passed to the underlying console's method of the same
   *   name.
   *
   * @returns {string}
   *
   * @example
   * const string = StringConsole.info('[info]: %o', someVariable)
   */
  static info(...args) {
    return this.#console.clear().info(...args);
  }
  /**
   * Captures a single line of text that would be logged to the console if
   * the console function of the same name were to be invoked. The string
   * is formatted according to the log colors, or any pre-existing colors as
   * those are untouched. After formatting, the string is returned.
   *
   * @param {...*} args the arguments to be logged. These can be of any
   *   type and will be passed to the underlying console's method of the same
   *   name.
   *
   * @returns {string}
   *
   * @example
   * const string = StringConsole.log('[log]: %o', someVariable)
   */
  static log(...args) {
    return this.#console.clear().log(...args);
  }
  /**
   * Captures a single line of text that would be logged to the console if
   * the console function of the same name were to be invoked. The string
   * is formatted according to the log colors, or any pre-existing colors as
   * those are untouched. After formatting, the string is returned.
   *
   * @param {...*} args the arguments to be logged. These can be of any
   *   type and will be passed to the underlying console's method of the same
   *   name.
   *
   * @returns {string}
   *
   * @example
   * const string = StringConsole.trace('[trace]: %o', someVariable)
   */
  static trace(...args) {
    return this.#console.clear().trace(...args);
  }
  /**
   * Captures a single line of text that would be logged to the console if
   * the console function of the same name were to be invoked. The string
   * is formatted according to the log colors, or any pre-existing colors as
   * those are untouched. After formatting, the string is returned.
   *
   * @param {...*} args the arguments to be logged. These can be of any
   *   type and will be passed to the underlying console's method of the same
   *   name.
   *
   * @returns {string}
   *
   * @example
   * const string = StringConsole.warn('[warn]: %o', someVariable)
   */
  static warn(...args) {
    return this.#console.clear().warn(...args);
  }
  /**
   * Internal instance of {@link StringConsole} used for static logging
   * methods.
   *
   * @type {StringConsole}
   */
  static #console = new _StringConsole(false);
  /**
   * A static map defining color codes for console output. Each color is
   * associated with an array containing two numbers, which represent
   * the ANSI escape codes for styling text in the terminal.
   *
   * The first number in the array is the suffix code for the standard
   * color, while the second number suffix code to undo the color. These
   * codes are useless without the pen prefix code.
   *
   * @type {Map<string, number[]>}
   * @see {@link StringConsole.pens}
   *
   * @example
   * // Accessing the color codes for 'red'
   * const redCodes = StringConsole.colors.get('red')
   * const fgCodes = StringConsole.pens.get('foreground')
   * const prefix = `\x1b[${fgCodes[0]}${redCodes[0]}m`
   * const suffix = `\x1b[${fgCodes[1]}${redCodes[1]}m`
   * // Outputs: "Text" in red but "!!" in the default color
   * console.log(`${prefix}Text!!${suffix}`)
   *
   * @description
   * This map is used to apply color coding to console messages, enhancing
   * readability and providing visual cues for different log levels.
   */
  static colors = /* @__PURE__ */ new Map([
    ["black", [0, 9]],
    ["red", [1, 9]],
    ["green", [2, 9]],
    ["yellow", [3, 9]],
    ["blue", [4, 9]],
    ["magenta", [5, 9]],
    ["cyan", [6, 9]],
    ["white", [7, 9]]
  ]);
  /**
   * A static map defining the color schemes for different logging levels.
   * Each log level is associated with an array of color styles that are
   * applied to the console output for that level.
   *
   * The available log levels and their corresponding color styles are:
   * - 'log': White
   * - 'info': Cyan
   * - 'warn': Yellow
   * - 'error': Red
   * - 'trace': Magenta
   * - 'debug': Bold Yellow
   *
   * @type {Map<string, string[]>}
   *
   * @example
   * const logColor = StringConsole.levels.get('log') // ['white']
   * const errorColor = StringConsole.levels.get('error') // ['red']
   */
  static levels = Object.defineProperties(/* @__PURE__ */ new Map([
    ["log", ["white"]],
    ["info", ["cyan"]],
    ["warn", ["yellow"]],
    ["error", ["red"]],
    ["trace", ["magenta"]],
    ["debug", ["bold", "yellow"]]
  ]), {
    color: {
      value: function color(key) {
        for (const value of this.get(key)) {
          if (_StringConsole.colors.has(value)) {
            return _StringConsole.colors.get(value);
          }
        }
        return _StringConsole.colors.get("white");
      },
      configurable: true
    },
    styles: {
      value: function styles(key) {
        const styles2 = [];
        for (const value of this.get(key)) {
          if (_StringConsole.styles.has(value)) {
            styles2.push(_StringConsole.styles.get(value));
          }
        }
        return styles2;
      },
      configurable: true
    }
  });
  /**
   * A static map defining the ANSI escape codes for different pen styles
   * used in console output. Each pen style is associated with an array
   * containing two numbers: the first for setting the style and the second
   * for resetting it.
   *
   * The available pen styles and their corresponding ANSI codes are:
   * - 'foreground': [3, 3] - Standard foreground color
   * - 'background': [4, 4] - Standard background color
   * - 'bright.foreground': [9, 3] - Bright foreground color
   * - 'bright.background': [10, 4] - Bright background color
   *
   * These are prefixes for both enabling and disabling. Normally a red color
   * is represented using SGR (Select Graphic Rendition) codes like \x1b[31m
   * for the foreground and \x1b[39m to return to normal color. So the 3
   * determines a foreground prefix for starting and stopping (the 3's in 31
   * and 39). Background prefixes are usually 4. These change for bright
   * colors which use 9 and 3, and 10 and 4, respectively.
   *
   * @type {Map<string, number[]>}
   *
   * @example
   * // [3, 3]
   * const foregroundPen = StringConsole.pens.get('foreground')
   *
   * // [10, 4]
   * const brightBackgroundPen = StringConsole.pens.get('bright.background')
   */
  static pens = /* @__PURE__ */ new Map([
    ["foreground", [3, 3]],
    ["background", [4, 4]],
    ["bright.foreground", [9, 3]],
    ["bright.background", [10, 4]]
  ]);
  /**
   * A static map defining ANSI escape codes for various text styles used
   * in console output. Each style is associated with an array containing
   * two escape codes: one for enabling the style and one for disabling it.
   *
   * The available styles and their corresponding ANSI codes are:
   * - 'reset': Resets all styles to default.
   * - 'blink': Enables blinking text.
   * - 'bold': Makes text bold.
   * - 'conceal': Conceals text.
   * - 'dim': Dims the text.
   * - 'italics': Italicizes the text.
   * - 'negative': Inverts the foreground and background colors.
   * - 'strike': Strikes through the text.
   * - 'underline': Underlines the text.
   *
   * @type {Map<string, string[]>}
   *
   * @example
   * const boldStyle = StringConsole.styles.get('bold')
   * // ['\x1b[1m', '\x1b[22m']
   */
  static styles = /* @__PURE__ */ new Map([
    ["reset", ["\x1B[0m"]],
    ["blink", ["\x1B[5m", "\x1B[25m"]],
    ["bold", ["\x1B[1m", "\x1B[22m"]],
    ["conceal", ["\x1B[8m", "\x1B[28m"]],
    ["dim", ["\x1B[2m", "\x1B[22m"]],
    ["italics", ["\x1B[3m", "\x1B[23m"]],
    ["negative", ["\x1B[7m", "\x1B[27m"]],
    ["strike", ["\x1B[9m", "\x1B[29m"]],
    ["underline", ["\x1B[4m", "\x1B[24m"]]
  ]);
  /**
   * Applies ANSI color codes to a given string based on specified options.
   * This method checks if the string already contains color codes or if
   * the input is not a string, in which case it returns the original input.
   * Otherwise, it formats the string with the specified color and pen
   * options.
   *
   * @param {string} string - The string to be colorized.
   * @param {Object} [options] - Configuration options for colorization.
   * @param {string} [options.level] - The log level determining
   *   which colors to apply.
   * @param {number[]} [options.rgb8] a single color code where 0 - 7, for
   * the 'standard' colors specified by the SGR sequences 30 to 37; 8-15 are
   * high intensity or bright colors,
   * @param {number[]} [options.rgb24] An array of three values, ordered, red,
   *   green and then blue. The values should range from 0 to 255.
   * @param {string|string[]} [options.styles] defaulting to an empty array, if
   *   supplied with a single known style {@link ~styles}, or an array of them.
   * @param {string} [options.pen='foreground'] - The pen type for color
   *   application, either 'foreground' or 'background'.
   * @param {Array} [options.buffer=[]] - An array to prepend to the
   *   formatted string.
   * @param {Array} [options.before=[]] - An array of strings to prepend
   *   before the main string.
   * @param {Array} [options.after=[]] - An array of strings to append
   *   after the main string. 16 - 231, for the colors in the 6 × 6 × 6 cube
   *   defined by 16 + 36 × r + 6 × g + b (0 ≤ r, g, b ≤ 5); 232-255:
   *   grayscale from dark to light in 24 steps.
   *
   * @returns {string} The colorized string with ANSI codes applied.
   *
   * @example
   * const coloredString = StringConsole.color('Hello', {
   *   level: 'info',
   *   pen: 'bright.foreground'
   * })
   * console.log(coloredString)
   */
  static color(string, options = {
    level: void 0,
    color: void 0,
    pen: "foreground",
    rgb8: void 0,
    rgb24: [186, 186, 186],
    styles: [],
    buffer: [],
    before: [],
    after: []
  }) {
    const { colors: Colors, styles: Styles, pens: Pens, levels: Levels } = this;
    let useColors = void 0;
    let useRGB = false;
    let styles = [];
    const pens = this.pens.get(options?.pen ?? "foreground");
    const [p0, p1] = pens;
    if (options?.styles) {
      if (Array.isArray(options.styles))
        styles = options.styles.filter((s) => Styles.has(s)).map((s) => Styles.get(s));
      else if (typeof options.styles === "string" && Styles.has(options.styles))
        styles = Styles.get(options.styles);
    }
    if (options?.level && Levels.has(options.level)) {
      useColors = Levels.color(options.level);
      const addlStyles = Levels.styles(options.level);
      if (addlStyles.length)
        styles = styles.concat(addlStyles);
    } else if (options?.color && Colors.has(options.color))
      useColors = Colors.get(options.color);
    else if (options?.rgb24 && Array.isArray(options.rgb24)) {
      useColors = [`\x1B[${p0}8;2;${options.rgb24.join(";")};m`, `\x1B[${p1}9m`];
      useRGB = true;
    } else if (options?.rgb8 && typeof options.rgb8 === "number") {
      useColors = [`\x1B[${p0}8;5;${options.rgb8}m`, `\x1B[${p1}9m`];
      useRGB = true;
    } else useColors = [9, 9];
    const [c0, c1] = useRGB ? useColors : useColors?.map((c, i) => `\x1B[${pens[i]}${c}m`) ?? [`\x1B[39;49m`];
    if (this.hasColor(string)) return string;
    if (typeof string !== "string") return string;
    if (string instanceof String) string = String(string);
    if (!useColors) return string;
    if (options?.buffer && !Array.isArray(options.buffer))
      options.buffer = [String(options.buffer)];
    if (options?.before && !Array.isArray(options.before))
      options.before = [String(options.before)];
    if (options?.after && !Array.isArray(options.after))
      options.after = [String(options.after)];
    const buffer = [].concat(options?.buffer ?? []);
    const before = [].concat(options?.before ?? []);
    const after = [].concat(options?.after ?? []);
    if (c0)
      before.push(c0);
    if (c1)
      after.push(c1);
    for (const style of styles) {
      if (style?.[0])
        before.push(style[0]);
      if (style?.[1])
        after.push(style[1]);
    }
    return [...buffer, before.join(""), string, after.join("")].join("");
  }
  /**
   * Applies color formatting to each argument based on the specified log level.
   *
   * This method processes an array of arguments, applying color formatting
   * to each one according to the provided log level. The color formatting
   * is determined by the `color` method, which uses the log level to
   * select the appropriate color scheme.
   *
   * @param {string} level - The log level that determines the color scheme
   * to be applied. Common levels include 'log', 'info', 'warn', 'error',
   * etc.
   * @param {Array} args - An array of arguments to be formatted. Each
   * argument will be processed individually to apply the color formatting.
   *
   * @returns {Array} A new array containing the formatted arguments with
   * color applied.
   *
   * @example
   * const formattedArgs = StringConsole.colorArgs(
   *   'info',
   *   ['Message 1', 'Message 2']
   * )
   * // formattedArgs will contain the messages with 'info' level
   * // color formatting
   */
  static colorArgs(level, args) {
    const newArgs = [];
    if (args === null || args === void 0 || !Array.isArray(args))
      return args;
    for (const arg of args) {
      newArgs.push(this.color(arg, { level }));
    }
    return newArgs;
  }
  /**
   * Determines if a given string contains ANSI color codes.
   *
   * This method checks for the presence of ANSI escape codes in the
   * provided string, which are used for color formatting in terminal
   * outputs. The presence of these codes indicates that the string
   * has color formatting applied.
   *
   * @param {string} string - The string to be checked for ANSI color codes.
   *
   * @returns {boolean} Returns true if the string contains ANSI color codes,
   * otherwise false.
   *
   * @example
   * const hasColor = StringConsole.hasColor('\x1b[31mRed Text\x1b[0m')
   * // hasColor will be true
   *
   * const noColor = StringConsole.hasColor('Plain Text')
   * // noColor will be false
   */
  static hasColor(string) {
    return string.includes("\x1B[");
  }
  /**
   * Applies a series of styles to a given string using ANSI escape codes.
   *
   * This method takes a string and an array of style names or style arrays,
   * and applies the corresponding ANSI escape codes to the string. The
   * styles are defined in the `styles` map, which associates style names
   * with their respective ANSI codes.
   *
   * @param {string} string - The string to which styles will be applied.
   * @param {string|string[]} styles - A style name or an array of style
   *   names/arrays to be applied. Each style can be a string that matches
   *   a key in the `styles` map or an array containing ANSI codes.
   *
   * @returns {string} The styled string with ANSI escape codes applied.
   *
   * @example
   * const styledText = StringConsole.style('Hello', ['bold', 'underline'])
   * // styledText will have 'Hello' with bold and underline styles
   */
  static style(string, styles) {
    const before = [];
    const after = [];
    const buffer = [];
    if (typeof styles === "string" && this.styles.has(styles)) {
      styles = [styles];
    }
    for (const style of styles) {
      let group = [];
      if (this.styles.has(style))
        group = this.styles.get(style);
      else if (Array.isArray(style) && style.length >= 1)
        group = style;
      if (group?.[0])
        before.push(group?.[0]);
      if (group?.[1])
        after.push(group?.[1]);
    }
    return [before.join(""), string, after.join("")].join("");
  }
  static {
    if (hasProcess) {
      Object.defineProperties(_StringConsole, {
        [Symbol.for("process.stdout.write")]: {
          value: Object.defineProperties(process.stdout.write, {
            [Symbol.for("original")]: { value: true, configurable: true },
            isOriginal: { get() {
              return true;
            }, configurable: true }
          }),
          configurable: true
        },
        [Symbol.for("process.stderr.write")]: {
          value: Object.defineProperties(process.stderr.write, {
            [Symbol.for("original")]: { value: true, configurable: true },
            isOriginal: { get() {
              return true;
            }, configurable: true }
          }),
          configurable: true
        }
      });
      if (!Reflect.has(_StringConsole, "writer")) {
        Object.defineProperties(_StringConsole, {
          writer: {
            value: _StringConsole[Symbol.for("process.stdout.write")],
            configurable: true
          },
          errorWriter: {
            value: _StringConsole[Symbol.for("process.stderr.write")],
            configurable: true
          }
        });
      }
    }
  }
};
var SC = StringConsole;
var StringConsoleExtension = new import_extension.Extension(StringConsole);
var StdoutGlobalPatches = new import_extension.Patch(globalThis, {
  [import_extension.Patch.kMutablyHidden]: {
    captureStdout
  }
});

// src/utils/toolkit.js
var map = /* @__PURE__ */ new Map([
  ["object", Object],
  [Object, "object"],
  ["Object", Object],
  ["number", Number],
  [Number, "number"],
  ["Number", Number],
  ["string", String],
  [String, "string"],
  ["String", String],
  ["function", Function],
  [Function, "function"],
  ["Function", Function],
  ["boolean", Boolean],
  [Boolean, "boolean"],
  ["Boolean", Boolean],
  ["bigint", BigInt],
  [BigInt, "bigint"],
  ["BigInt", BigInt],
  ["symbol", Symbol],
  [Symbol, "symbol"],
  ["Symbol", Symbol],
  ["undefined", void 0],
  [void 0, "undefined"],
  ["null", null],
  [null, "null"]
]);
var is = {
  /**
   * Checks if a value matches a specified type or class.
   *
   * This function determines if the provided value matches the specified
   * type or class. It supports both primitive types and class constructors.
   *
   * @param {*} value - The value to check.
   * @param {*} typeOrClass - The type or class to compare against.
   * @returns {boolean} True if the value matches the type or class,
   *   false otherwise.
   *
   * @example
   * // Returns true
   * is.a(42, 'number')
   *
   * @example
   * // Returns true
   * is.a(new Date(), Date)
   *
   * @example
   * // Returns false
   * is.a('string', Number)
   */
  a(value, typeOrClass) {
    const valueType = typeof value;
    const valueTag = this.object(value) && value[Symbol.toStringTag];
    if (value === typeOrClass)
      return true;
    if (this.function(typeOrClass)) {
      const typeTag = this.object(typeOrClass) && typeOrClass[Symbol.toStringTag];
      if (valueTag && valueTag === typeOrClass.name)
        return true;
      if (typeOrClass?.prototype && value instanceof typeOrClass)
        return true;
      return map.get(valueType) === typeOrClass;
    } else if (map.get(valueType)?.name === typeOrClass)
      return true;
    else if (valueType === typeOrClass || valueTag === typeOrClass)
      return true;
    return false;
  },
  /**
   * Check if a value is an accessor descriptor.
   *
   * An accessor descriptor is an object that describes the configuration of a
   * property on an object, specifically focusing on the 'get' and 'set'
   * attributes. Computed accessor descriptors are invalid if they also have
   * a `value` and/or `writable` property.
   *
   * @param value The value to check.
   * @returns True if the value is an accessor descriptor, false otherwise.
   *
   * @example
   * // Returns true
   * is.accessorDescriptor({ get: () => 42, set: () => {} })
   *
   * // Returns false
   * is.accessorDescriptor({ value: 42, writable: true })
   */
  accessorDescriptor(value) {
    return !!(this.descriptor(value) && (value?.get || value?.set) && value?.writable === void 0 && value?.value === void 0);
  },
  /**
   * Check if a value is an array.
   *
   * @param value The value to check.
   * @returns True if the value is an array, false otherwise.
   *
   * @example
   * is.array([1, 2, 3]) // true
   * is.array('string') // false
   */
  array(value) {
    return Array.isArray(value);
  },
  /**
   * Check if a value is a bigint.
   *
   * @param value The value to check.
   * @returns True if the value is a bigint, false otherwise.
   *
   * @example
   * is.bigint(123n) // true
   * is.bigint(123) // false
   */
  bigint(value) {
    return typeof value === "bigint" || value instanceof globalThis?.BigInt;
  },
  /**
   * Checks if a value is strictly a boolean (true or false).
   *
   * This method verifies if the provided value is either `true` or `false`.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is a boolean, false otherwise.
   *
   * @example
   * is.boolean(true) // true
   * is.boolean(false) // true
   * is.boolean(1) // false
   * is.boolean("true") // false
   */
  boolean(value) {
    return [true, false].some((bool) => bool === value);
  },
  /**
   * Check if an object is callable. This function is more or less a
   * synonym or alias for `is.function()`.
   *
   * @param object The object to check.
   * @returns True if the object is callable, false otherwise.
   *
   * @note if you wish to know if a descriptor has a callable `value`,
   * `get`, or `set` function, use `is.callableDescriptor` instead.
   *
   * @example
   * is.callable(function() {}) // true
   */
  callable(object) {
    return this.function(object);
  },
  /**
   * Check if an object is a callable descriptor. It looks to see if the
   * object represents a descriptor that is callable by checking object
   * properties named `value`, `get`, and `set`. If any of the three
   * yields a function type, true is returned.
   *
   * @param object The object to check.
   * @returns True if the object is a callable descriptor, false otherwise.
   *
   * @example
   * is.callableDescriptor({ get: function() {} }) // true
   * is.callableDescriptor(123) // false
   *
   * // Note the differences between these
   * const object = { get name() { return "Brie"; } }
   * const descriptor = Object.getOwnPropertyDescriptor(object, 'name')
   * is.callableDescriptor(object) // false
   * is.callableDescriptor(descriptor) // true
   */
  callableDescriptor(object) {
    const { value, get, set } = this.shiny(object) ? object : {};
    return [value, get, set].some((val) => this.function(val));
  },
  /**
   * Check if a value is a data property descriptor.
   *
   * A data descriptor is an object that describes the configuration of a
   * property on an object, specifically focusing on the 'value' and
   * 'writable' attributes. The descriptor is invalid if it contains
   * the accessor descriptors `get` or `set`.
   *
   * @param value The value to check.
   * @returns True if the value is a data descriptor, false otherwise.
   *
   * @example
   * // Returns true
   * is.dataDescriptor({ value: 42, writable: true })
   *
   * // Returns false
   * is.dataDescriptor({ get: () => 42, set: () => {} })
   */
  dataDescriptor(value) {
    return !!(this.descriptor(value) && (value?.value !== void 0 || value?.writable !== void 0) && value?.get === void 0 && value?.set === void 0);
  },
  /**
   * Check if a value is a property descriptor.
   *
   * A property descriptor is an object that describes the configuration of a
   * property on an object. This function checks if the provided value is an
   * object and contains any of the standard property descriptor keys.
   *
   * @param value The value to check.
   * @returns True if the value is a property descriptor, false otherwise.
   *
   * @example
   * is.descriptor({ configurable: true, enumerable: false }) // true
   * is.descriptor({ get: () => {}, set: () => {} }) // true
   * is.descriptor({}) // false
   */
  descriptor(value) {
    if (!is.object(value)) {
      return false;
    }
    const _has = (key) => Reflect.has(value, key);
    const hasBase = ["configurable", "enumerable"].some((key) => _has(key));
    const hasData = ["value", "writable"].some((key) => _has(key));
    const hasAccess = ["get", "set"].some((key) => _has(key));
    return hasBase || hasData || hasAccess;
  },
  /**
   * Checks if a value is strictly false.
   *
   * This method verifies if the provided value is strictly `false`.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is strictly false, false otherwise.
   *
   * @example
   * is.false(false) // true
   * is.false(true) // false
   * is.false(0) // false
   */
  false(value) {
    return value === false;
  },
  /**
   * Checks if a value is falsy.
   *
   * This method converts the provided value to a boolean and returns
   * `true` if the value is falsy (i.e., false, 0, "", null, undefined,
   * or NaN).
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is falsy, false otherwise.
   *
   * @example
   * is.falsy(0) // true
   * is.falsy("") // true
   * is.falsy(1) // false
   * is.falsy("hello") // false
   */
  falsy(value) {
    return !!!value;
  },
  /**
   * Alias for the `falsy` method.
   *
   * This method is an alias for `is.falsy` and performs the same check.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is falsy, false otherwise.
   *
   * @example
   * is.falsey(0) // true
   * is.falsey("") // true
   * is.falsey(1) // false
   * is.falsey("hello") // false
   */
  falsey(value) {
    return this.falsy(value);
  },
  /**
   * Check if a value is a function.
   *
   * @param value The value to check.
   * @returns True if the value is a function, false otherwise.
   *
   * @example
   * is.function(function() {}) // true
   * is.function(123) // false
   */
  function(value) {
    return typeof value === "function" || value instanceof Function;
  },
  /**
   * Check if a value is iterable. Depending on the environment, JavaScript
   * will permit `'string'[Symbol.iterator]()` whereas in some places, you
   * will need to wrap string in an object first. Since other JSVM provided
   * environments may or may not be leniant with this, we play it safe by
   * implicitly object converting values before checking for the symbol. If
   * a value is already an object, it will simply be passed through.
   *
   * @param value The value to check.
   * @returns True if the value is iterable, false otherwise.
   *
   * @example
   * is.iterable([1, 2, 3]) // true
   * is.iterable('string') // true
   * is.iterable(123) // false
   */
  iterable(value) {
    const object = Object(value);
    return object && Reflect.has(object, Symbol.iterator);
  },
  /**
   * Check if a value is null or undefined.
   *
   * @param value The value to check.
   * @returns True if the value is null or undefined, false otherwise.
   *
   * @example
   * is.nullish(null) // true
   * is.nullish(undefined) // true
   * is.nullish('value') // false
   */
  nullish(value) {
    return value === null || value === void 0;
  },
  /**
   * Check if a value is a number.
   *
   * @param value The value to check.
   * @returns True if the value is a number, false otherwise.
   *
   * @example
   * is.number(123) // true
   * is.number('123') // false
   */
  number(value) {
    return typeof value === "number" || value instanceof Number;
  },
  /**
   * Check if a value is an object.
   *
   * @param value The value to check.
   * @returns True if the value is an object, false otherwise.
   *
   * @example
   * is.object({}) // true
   * is.object(null) // false
   */
  object(value) {
    return !!(value && typeof value === "object");
  },
  /**
   * The {@link Object#entries} function returns the properties of a given
   * value as an array of arrays where each element of the inner arrays is
   * a valid object key (so one of {@link String}, {@link Number}, or
   * {@link Symbol}) and the second element is the value of the pair which
   * can be any type.
   *
   * This function vets this criteria and would return true for each entry
   * in the returned outer array of a call to {@link Object#entries}.
   *
   * @param {any} value the value to test
   * @returns {boolean} true if the value is a valid object entry in the
   * form of `[key, value]`.
   */
  objectEntry(value) {
    if (!// Must be an array
    (Array.isArray(value) && // Must have only two elements
    value.length == 2 && // Must have its first element be string|number|symbol
    (this.string(value[0]) || this.number(value[0]) || this.symbol(value[0])))) {
      return false;
    }
    return true;
  },
  /**
   * Check if a value is a valid object key. Valid object keys are strings,
   * numbers, or symbols — the same types accepted as property keys in
   * JavaScript objects.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is a string, number, or symbol,
   * false otherwise.
   *
   * @example
   * is.objectKey('name') // true
   * is.objectKey(0) // true
   * is.objectKey(Symbol('id')) // true
   * is.objectKey({}) // false
   * is.objectKey(null) // false
   */
  objectKey(value) {
    return this.string(value) || this.number(value) || this.symbol(value);
  },
  /**
   * Check if a value is a primitive type.
   *
   * This function determines if the provided value is one of the JavaScript
   * primitive types: string, number, boolean, bigint, or symbol.
   *
   * @param value The value to check.
   * @returns True if the value is a primitive type, false otherwise.
   *
   * @example
   * // Returns true
   * is.primitive('hello')
   *
   * // Returns true
   * is.primitive(123)
   *
   * // Returns true
   * is.primitive(true)
   *
   * // Returns true
   * is.primitive(123n)
   *
   * // Returns true
   * is.primitive(Symbol('symbol'))
   *
   * // Returns false
   * is.primitive({})
   *
   * // Returns false
   * is.primitive([])
   */
  primitive(value) {
    if (this.nullish(value))
      return true;
    return ["string", "number", "boolean", "bigint", "symbol"].some(
      (type) => typeof value === type
    );
  },
  /**
   * The use of `typeof` is not a safe guarantor when it comes to Reflect
   * supported values. Any non-null value that returns a `typeof` either
   * `object` or `function` should suffice. Note that arrays return 'object'
   * when run through `typeof`. Shiny is clearly a reference to something
   * reflective and is much shorter to type. Also, Mal says shiny. :)
   *
   * @param value The value to check.
   * @returns True if the value is an object or a function, false otherwise.
   *
   * @example
   * is.shiny({}) // true
   * is.shiny(function() {}) // true
   * is.shiny(123) // false
   */
  shiny(value) {
    return !!(this.object(value) || this.function(value));
  },
  /**
   * Check if a value is a string.
   *
   * @param value The value to check.
   * @returns True if the value is a string, false otherwise.
   *
   * @example
   * is.string('hello') // true
   * is.string(123) // false
   */
  string(value) {
    return typeof value === "string" || value instanceof String;
  },
  /**
   * Checks if a value is a symbol.
   *
   * This function determines whether the provided value is of type
   * 'symbol' or an instance of the Symbol object.
   *
   * @param value - The value to check.
   * @returns True if the value is a symbol, false otherwise.
   *
   * @example
   * is.symbol(Symbol('foo')) // Returns true
   * is.symbol('foo') // Returns false
   */
  symbol(value) {
    return typeof value === "symbol" || value instanceof Symbol;
  },
  /**
   * Checks if a value is strictly true.
   *
   * This method verifies if the provided value is strictly `true`.
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is strictly true, false otherwise.
   *
   * @example
   * is.true(true) // true
   * is.true(false) // false
   * is.true(1) // false
   */
  true(value) {
    return value === true;
  },
  /**
   * Checks if a value is truthy.
   *
   * This method converts the provided value to a boolean and returns
   * `true` if the value is truthy (i.e., not false, 0, "", null, undefined,
   * or NaN).
   *
   * @param {*} value - The value to check.
   * @returns {boolean} True if the value is truthy, false otherwise.
   *
   * @example
   * is.truthy(1) // true
   * is.truthy("hello") // true
   * is.truthy(0) // false
   * is.truthy("") // false
   */
  truthy(value) {
    return !!value;
  }
};
var si = {
  /**
   * Inline if-then-else based on whether value matches a specified type or
   * class. Delegates the condition check to {@link is#a}.
   *
   * @param {*} value - The value to check.
   * @param {*} typeOrClass - The type or class to compare against.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value matches typeOrClass.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value does not match typeOrClass.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.a(42, 'number', 'yes', 'no') // 'yes'
   * si.a('str', Number, 'yes', 'no') // 'no'
   * si.a(42, 'number', () => 'computed', 'no') // 'computed'
   */
  a(value, typeOrClass, thenValue, elseValue) {
    return ifThenElse(is.a(value, typeOrClass), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is an accessor descriptor.
   * Delegates the condition check to {@link is#accessorDescriptor}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is an accessor descriptor.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not an accessor descriptor.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.accessorDescriptor({ get: () => 42 }, 'yes', 'no') // 'yes'
   * si.accessorDescriptor({ value: 42 }, 'yes', 'no') // 'no'
   * si.accessorDescriptor({ get: () => 42 }, () => 'computed', 'no') // 'computed'
   */
  accessorDescriptor(value, thenValue, elseValue) {
    return ifThenElse(is.accessorDescriptor(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is an array.
   * Delegates the condition check to {@link is#array}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is an array.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not an array.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.array([1, 2, 3], 'yes', 'no') // 'yes'
   * si.array('string', 'yes', 'no') // 'no'
   * si.array([1, 2, 3], () => 'computed', 'no') // 'computed'
   */
  array(value, thenValue, elseValue) {
    return ifThenElse(is.array(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a bigint.
   * Delegates the condition check to {@link is#bigint}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a bigint.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a bigint.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.bigint(123n, 'yes', 'no') // 'yes'
   * si.bigint(123, 'yes', 'no') // 'no'
   * si.bigint(123n, () => 'computed', 'no') // 'computed'
   */
  bigint(value, thenValue, elseValue) {
    return ifThenElse(is.bigint(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a boolean.
   * Delegates the condition check to {@link is#boolean}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a boolean.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a boolean.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.boolean(true, 'yes', 'no') // 'yes'
   * si.boolean(1, 'yes', 'no') // 'no'
   * si.boolean(false, () => 'computed', 'no') // 'computed'
   */
  boolean(value, thenValue, elseValue) {
    return ifThenElse(is.boolean(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether object is callable.
   * Delegates the condition check to {@link is#callable}.
   *
   * @param {*} object - The object to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if object is callable.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if object is not callable.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.callable(function() {}, 'yes', 'no') // 'yes'
   * si.callable(123, 'yes', 'no') // 'no'
   * si.callable(function() {}, () => 'computed', 'no') // 'computed'
   */
  callable(object, thenValue, elseValue) {
    return ifThenElse(is.callable(object), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether object is a callable descriptor.
   * Delegates the condition check to {@link is#callableDescriptor}.
   *
   * @param {*} object - The object to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if object is a callable descriptor.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if object is not a callable descriptor.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.callableDescriptor({ get: function() {} }, 'yes', 'no') // 'yes'
   * si.callableDescriptor(123, 'yes', 'no') // 'no'
   * si.callableDescriptor({ get: function() {} }, () => 'computed', 'no') // 'computed'
   */
  callableDescriptor(object, thenValue, elseValue) {
    return ifThenElse(is.callableDescriptor(object), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a data property descriptor.
   * Delegates the condition check to {@link is#dataDescriptor}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a data descriptor.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a data descriptor.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.dataDescriptor({ value: 42, writable: true }, 'yes', 'no') // 'yes'
   * si.dataDescriptor({ get: () => 42 }, 'yes', 'no') // 'no'
   * si.dataDescriptor({ value: 42 }, () => 'computed', 'no') // 'computed'
   */
  dataDescriptor(value, thenValue, elseValue) {
    return ifThenElse(is.dataDescriptor(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a property descriptor.
   * Delegates the condition check to {@link is#descriptor}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a property descriptor.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a property descriptor.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.descriptor({ configurable: true }, 'yes', 'no') // 'yes'
   * si.descriptor({}, 'yes', 'no') // 'no'
   * si.descriptor({ get: () => {} }, () => 'computed', 'no') // 'computed'
   */
  descriptor(value, thenValue, elseValue) {
    return ifThenElse(is.descriptor(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is strictly false.
   * Delegates the condition check to {@link is#false}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is strictly false.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not strictly false.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.false(false, 'yes', 'no') // 'yes'
   * si.false(0, 'yes', 'no') // 'no'
   * si.false(false, () => 'computed', 'no') // 'computed'
   */
  false(value, thenValue, elseValue) {
    return ifThenElse(is.false(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is falsy.
   * Delegates the condition check to {@link is#falsy}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is falsy.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not falsy.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.falsy(0, 'yes', 'no') // 'yes'
   * si.falsy(1, 'yes', 'no') // 'no'
   * si.falsy('', () => 'computed', 'no') // 'computed'
   */
  falsy(value, thenValue, elseValue) {
    return ifThenElse(is.falsy(value), thenValue, elseValue);
  },
  /**
   * Alias for {@link si#falsy}. Inline if-then-else based on whether value
   * is falsy. Delegates the condition check to {@link is#falsey}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is falsy.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not falsy.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.falsey(0, 'yes', 'no') // 'yes'
   * si.falsey(1, 'yes', 'no') // 'no'
   * si.falsey('', () => 'computed', 'no') // 'computed'
   */
  falsey(value, thenValue, elseValue) {
    return ifThenElse(is.falsey(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a function.
   * Delegates the condition check to {@link is#function}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a function.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a function.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.function(function() {}, 'yes', 'no') // 'yes'
   * si.function(123, 'yes', 'no') // 'no'
   * si.function(function() {}, () => 'computed', 'no') // 'computed'
   */
  function(value, thenValue, elseValue) {
    return ifThenElse(is.function(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is iterable.
   * Delegates the condition check to {@link is#iterable}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is iterable.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not iterable.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.iterable([1, 2, 3], 'yes', 'no') // 'yes'
   * si.iterable(123, 'yes', 'no') // 'no'
   * si.iterable('string', () => 'computed', 'no') // 'computed'
   */
  iterable(value, thenValue, elseValue) {
    return ifThenElse(is.iterable(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is null or undefined.
   * Delegates the condition check to {@link is#nullish}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is nullish.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not nullish.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.nullish(null, 'yes', 'no') // 'yes'
   * si.nullish('value', 'yes', 'no') // 'no'
   * si.nullish(undefined, () => 'computed', 'no') // 'computed'
   */
  nullish(value, thenValue, elseValue) {
    return ifThenElse(is.nullish(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a number.
   * Delegates the condition check to {@link is#number}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a number.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a number.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.number(123, 'yes', 'no') // 'yes'
   * si.number('123', 'yes', 'no') // 'no'
   * si.number(123, () => 'computed', 'no') // 'computed'
   */
  number(value, thenValue, elseValue) {
    return ifThenElse(is.number(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is an object.
   * Delegates the condition check to {@link is#object}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is an object.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not an object.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.object({}, 'yes', 'no') // 'yes'
   * si.object(null, 'yes', 'no') // 'no'
   * si.object({}, () => 'computed', 'no') // 'computed'
   */
  object(value, thenValue, elseValue) {
    return ifThenElse(is.object(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a valid object entry.
   * Delegates the condition check to {@link is#objectEntry}.
   *
   * @param {any} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a valid object entry.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a valid object entry.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.objectEntry(['key', 42], 'yes', 'no') // 'yes'
   * si.objectEntry([1, 2, 3], 'yes', 'no') // 'no'
   * si.objectEntry(['key', 42], () => 'computed', 'no') // 'computed'
   */
  objectEntry(value, thenValue, elseValue) {
    return ifThenElse(is.objectEntry(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a valid object key.
   * Delegates the condition check to {@link is#objectKey}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a valid object key.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a valid object key.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.objectKey('name', 'yes', 'no') // 'yes'
   * si.objectKey({}, 'yes', 'no') // 'no'
   * si.objectKey(Symbol('id'), () => 'computed', 'no') // 'computed'
   */
  objectKey(value, thenValue, elseValue) {
    return ifThenElse(is.objectKey(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a primitive type.
   * Delegates the condition check to {@link is#primitive}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a primitive.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a primitive.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.primitive('hello', 'yes', 'no') // 'yes'
   * si.primitive({}, 'yes', 'no') // 'no'
   * si.primitive(123, () => 'computed', 'no') // 'computed'
   */
  primitive(value, thenValue, elseValue) {
    return ifThenElse(is.primitive(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is shiny (object or function).
   * Delegates the condition check to {@link is#shiny}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is shiny.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not shiny.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.shiny({}, 'yes', 'no') // 'yes'
   * si.shiny(123, 'yes', 'no') // 'no'
   * si.shiny(function() {}, () => 'computed', 'no') // 'computed'
   */
  shiny(value, thenValue, elseValue) {
    return ifThenElse(is.shiny(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a string.
   * Delegates the condition check to {@link is#string}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a string.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a string.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.string('hello', 'yes', 'no') // 'yes'
   * si.string(123, 'yes', 'no') // 'no'
   * si.string('hello', () => 'computed', 'no') // 'computed'
   */
  string(value, thenValue, elseValue) {
    return ifThenElse(is.string(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is a symbol.
   * Delegates the condition check to {@link is#symbol}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is a symbol.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not a symbol.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.symbol(Symbol('foo'), 'yes', 'no') // 'yes'
   * si.symbol('foo', 'yes', 'no') // 'no'
   * si.symbol(Symbol('foo'), () => 'computed', 'no') // 'computed'
   */
  symbol(value, thenValue, elseValue) {
    return ifThenElse(is.symbol(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else using an arbitrary condition. If condition is a
   * function, it is called and its result is used as the condition; otherwise
   * the condition value is evaluated directly.
   *
   * @param {function|*} condition - The condition to evaluate. If a function,
   *   it is called and its return value is used as the condition.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if the condition is truthy.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if the condition is falsy.
   * @returns {*} The result of thenValue if the condition is truthy,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.then(true, 'yes', 'no') // 'yes'
   * si.then(false, 'yes', 'no') // 'no'
   * si.then(() => true, 'yes', 'no') // 'yes'
   * si.then(() => false, () => 'computed', 'no') // 'no'
   */
  then(condition, thenValue, elseValue) {
    return ifThenElse(
      is.function(condition) ? condition() : condition,
      thenValue,
      elseValue
    );
  },
  /**
   * Inline if-then-else based on whether value is strictly true.
   * Delegates the condition check to {@link is#true}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is strictly true.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not strictly true.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.true(true, 'yes', 'no') // 'yes'
   * si.true(1, 'yes', 'no') // 'no'
   * si.true(true, () => 'computed', 'no') // 'computed'
   */
  true(value, thenValue, elseValue) {
    return ifThenElse(is.true(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is truthy.
   * Delegates the condition check to {@link is#truthy}.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is truthy.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not truthy.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.truthy(1, 'yes', 'no') // 'yes'
   * si.truthy(0, 'yes', 'no') // 'no'
   * si.truthy("hello", () => 'computed', 'no') // 'computed'
   */
  truthy(value, thenValue, elseValue) {
    return ifThenElse(is.truthy(value), thenValue, elseValue);
  },
  /**
   * Inline if-then-else based on whether value is undefined.
   * Delegates the condition check to {@link is#a} with type 'undefined'.
   *
   * @param {*} value - The value to check.
   * @param {function|*} thenValue - Returned (or called and its result
   *   returned) if value is undefined.
   * @param {function|*} elseValue - Returned (or called and its result
   *   returned) if value is not undefined.
   * @returns {*} The result of thenValue if the condition is true,
   *   elseValue otherwise. If thenValue or elseValue is a function,
   *   its return value is used instead.
   *
   * @example
   * si.undefined(undefined, 'yes', 'no') // 'yes'
   * si.undefined('value', 'yes', 'no') // 'no'
   * si.undefined(undefined, () => 'computed', 'no') // 'computed'
   */
  undefined(value, thenValue, elseValue) {
    return ifThenElse(is.a(value, "undefined"), thenValue, elseValue);
  }
};
var has = function has2(object, key) {
  if ([Map, Set, WeakMap, WeakSet].some((i) => object instanceof i)) {
    return object.has(key);
  }
  return is.shiny(object) && Reflect.has(object, key);
};
Object.assign(has, {
  /**
   * Checks if an object contains all specified keys.
   *
   * This function determines if the provided object contains all the keys
   * specified in the keys array. It supports various types of objects
   * including Map, Set, WeakMap, and WeakSet. For other objects, it uses
   * the Reflect API to check for the keys.
   *
   * @param object The object to check.
   * @param keys The array of keys to look for in the object.
   * @returns True if the object contains all the keys, false otherwise.
   *
   * @example
   * // Returns true
   * has.all(new Map([
   *   ['key1', 'value1'], ['key2', 'value2']
   * ]), ['key1', 'key2'])
   *
   * @example
   * // Returns false
   * has.all({}, ['key1', 'key2'])
   */
  all(object, keys) {
    if (!is.shiny(object) || !is.array(keys) || !keys.length) {
      return false;
    }
    return keys.every((key) => has(object, key));
  },
  /**
   * Checks if an object contains at least one of the specified keys.
   *
   * This function determines if the provided object contains at least one
   * of the keys specified in the keys array. It supports various types of
   * objects including Map, Set, WeakMap, and WeakSet. For other objects,
   * it uses the Reflect API to check for the keys.
   *
   * @param object The object to check.
   * @param keys The array of keys to look for in the object.
   * @returns True if the object contains at least one of the keys, false
   * otherwise.
   *
   * @example
   * // Returns true
   * has.some(new Map([['key1', 'value1'], ['key2', 'value2']]), ['key1'])
   *
   * @example
   * // Returns false
   * has.some({}, ['key1', 'key2'])
   */
  some(object, keys) {
    if (!is.shiny(object) || !is.array(keys) || !keys.length) {
      return false;
    }
    return keys.some((key) => has(object, key));
  },
  /**
   * Checks if an object has a 'prototype' property.
   *
   * This function is one way to determine if a supplied function is a big
   * arrow function or not. Regular functions and class functions, both
   * static and instance level, all have prototypes. Only big arrow functions
   * do not.
   *
   * @param {Object} object - The object to check.
   * @returns {boolean} True if the object has a 'prototype' property,
   * false otherwise.
   *
   * @example
   * // Returns true
   * has.prototype(function() {})
   *
   * @example
   * // Returns false
   * has.prototype(() => {})
   * has.prototype(5)
   * has.prototype(true)
   */
  prototype(object) {
    return is.shiny(object) && has(object, "prototype");
  },
  /**
   * Checks if an object has a custom string tag.
   *
   * This method determines if the object has a Symbol.toStringTag property,
   * which is used to customize the behavior of Object.prototype.toString().
   *
   * @param object - The object to check.
   * @returns True if the object has a custom string tag, false otherwise.
   *
   * @example
   * const obj = { [Symbol.toStringTag]: 'CustomObject' }
   * has.stringTag(obj) // Returns true
   */
  stringTag(object) {
    return is.object(object) && has(object, Symbol.toStringTag);
  },
  /**
   * Checks if an object has a custom toPrimitive method.
   *
   * This method determines if the object has a Symbol.toPrimitive property,
   * which is used to convert an object to a primitive value.
   *
   * @param object - The object to check.
   * @returns True if the object has a custom toPrimitive method,
   * false otherwise.
   *
   * @example
   * const obj = { [Symbol.toPrimitive]: () => 42 }
   * has.toPrimitive(obj) // Returns true
   */
  toPrimitive(object) {
    return is.object(object) && has(object, Symbol.toPrimitive);
  },
  /**
   * Checks if an object has a custom valueOf method.
   *
   * This method determines if the object has a valueOf property that is a
   * function, which is used to convert an object to a primitive value.
   *
   * @param object - The object to check.
   * @returns True if the object has a custom valueOf method, false otherwise.
   *
   * @example
   * const obj = { valueOf: () => 42 }
   * has.valueOfFn(obj) // Returns true
   */
  valueOfFn(object) {
    return is.object(object) && Object.hasOwn(object, "valueOf") && is.function(object.valueOf);
  }
});
var as = {
  /**
   * Converts a value to an array if it is iterable.
   *
   * @param value The value to convert.
   * @returns The converted array if the value is iterable, otherwise undefined.
   *
   * @example
   * // Returns [1, 2, 3]
   * as.array([1, 2, 3])
   *
   * @example
   * // Returns ['s', 't', 'r', 'i', 'n', 'g']
   * as.array('string')
   *
   * @example
   * // Returns undefined
   * as.array(123)
   */
  array(value) {
    return is.iterable(value) && Array.from(value) || void 0;
  },
  /**
   * Converts a value to an object. If the supplied value is a primitive
   * value, in many cases, this will convert it to an object instance of
   * that type. Numbers, strings, symbols, and big integers, all have
   * object instance variants. Wrapping them in a call to `Object()` will
   * convert the primitive into this instance variant.
   *
   * @param value The value to convert.
   * @returns The converted object.
   *
   * @example
   * // Returns { key: 'value' }
   * as.object({ key: 'value' })
   *
   * @example
   * // String instance as oppposed to primitive string
   * typeof as.object('string') // 'object'
   * as.object('string') instanceof String // true
   * 'string' instanceof String // false
   *
   * @example
   * // Returns {}
   * as.object(null)
   */
  object(value) {
    return Object(value);
  },
  /**
   * Converts a given value to a string. This function handles various types
   * of values, including null, undefined, objects with custom
   * [Symbol.toPrimitive] methods, and objects with toString or valueOf
   * methods.
   *
   * @param value The value to convert to a string.
   * @param use Optional configuration object:
   *        - description: If true, returns the description of a Symbol.
   *        - stringTag: If true, returns the [Symbol.toStringTag] value if present.
   * @returns The string representation of the value.
   *
   * @example
   * // Returns 'null'
   * as.string(null)
   *
   * @example
   * // Returns '123'
   * as.string(123)
   *
   * @example
   * // Returns 'custom'
   * const obj = {
   *   [Symbol.toPrimitive](hint) {
   *     if (hint === 'string') return 'custom'
   *     return null
   *   }
   * }
   * as.string(obj)
   *
   * @example
   * // Returns 'mySymbol'
   * as.string(Symbol('mySymbol'), { description: true })
   *
   * @example
   * // Returns 'Array'
   * as.string([], { stringTag: true })
   */
  string(value, use = {
    description: false,
    stringTag: false
  }) {
    if (value === null || value === void 0) {
      return String(value);
    }
    if (is.symbol(value) && use?.description) {
      return value.description;
    }
    if (has.stringTag(value) && use?.stringTag) {
      return value[Symbol.toStringTag];
    }
    if (is.function(value?.[Symbol.toPrimitive])) {
      const primitiveValue = value[Symbol.toPrimitive]("string");
      if (is.string(primitiveValue)) {
        return primitiveValue;
      }
    }
    if (is.function(value?.valueOf)) {
      const valueOfValue = value.valueOf();
      if (is.string(valueOfValue)) {
        return valueOfValue;
      }
      if (!is.object(valueOfValue)) {
        return String(valueOfValue);
      }
    }
    if (is.function(value?.toString)) {
      const stringValue = value.toString();
      if (is.string(stringValue)) {
        return stringValue;
      }
    }
    return String(value);
  },
  /**
   * Converts a given value to a string representing an integer.
   *
   * This method first converts the value to a number string and then extracts
   * the integer part by splitting the string at the decimal point.
   *
   * @param value The value to convert to an integer string.
   * @returns The integer part of the value as a string.
   *
   * @example
   * // Returns '123'
   * as.integerString(123.456)
   *
   * @example
   * // Returns '0'
   * as.integerString('0.789')
   */
  integerString(value) {
    return this.numberString(value).split(".")[0];
  },
  /**
   * Converts a given value to a string representing a number.
   *
   * This method first converts the value to a string, trims any whitespace,
   * and removes any non-numeric characters except for '.', 'e', 'E', '+',
   * and '-'. It then uses a regular expression to match a floating-point
   * number, allowing an optional leading '+' or '-' sign, digits before
   * and after a single decimal point.
   *
   * @param value The value to convert to a number string.
   * @returns The sanitized number string or an empty string if no valid
   * float was found.
   *
   * @example
   * // Returns '123.456'
   * as.numberString('  123.456abc  ')
   *
   * @example
   * // Returns '-0.789'
   * as.numberString('-0.789xyz')
   */
  numberString(value) {
    const string = this.string(value).trim().replace(/[^0-9.eE+-]/g, "");
    const sanitizedStr = string.match(/^[-+]?\d*\.?\d+([eE][-+]?\d+)?/);
    return sanitizedStr ? sanitizedStr[0] : "";
  },
  /**
   * Converts a given value to a number.
   *
   * This method uses the `numberString` method to sanitize the input value
   * and then converts it to a number.
   *
   * @param value The value to convert to a number.
   * @returns The numeric representation of the value.
   *
   * @example
   * // Returns 123.456
   * as.number('123.456abc')
   *
   * @example
   * // Returns -0.789
   * as.number('-0.789xyz')
   */
  number(value) {
    return Number(this.numberString(value));
  },
  /**
   * Converts a given value to a bigint.
   *
   * This method uses the `integerString` method to sanitize the input value
   * and then converts it to a bigint.
   *
   * @param value The value to convert to a bigint.
   * @returns The bigint representation of the value.
   *
   * @example
   * // Returns 123n
   * as.bigint('123.456abc')
   *
   * @example
   * // Returns 0n
   * as.bigint('0.789xyz')
   */
  bigint(value) {
    const BigInt2 = globalThis?.BigInt;
    return BigInt2(this.integerString(value));
  },
  /**
   * Converts a given value to a boolean.
   *
   * This method takes a value, converts it to a string, and then checks
   * if it matches common representations of boolean values. It returns
   * `true` for "1", "yes", and "true" (case insensitive), and `false`
   * for "0", "no", and "false" (case insensitive). For any other values,
   * it returns the boolean representation of the value.
   *
   * @param {*} value - The value to convert to a boolean.
   * @returns {boolean} The boolean representation of the value.
   *
   * @example
   * // Returns true
   * as.boolean("yes")
   *
   * @example
   * // Returns false
   * as.boolean("no")
   *
   * @example
   * // Returns true
   * as.boolean(1)
   *
   * @example
   * // Returns false
   * as.boolean(0)
   *
   * @example
   * // Returns true
   * as.boolean("true")
   *
   * @example
   * // Returns false
   * as.boolean("false")
   *
   * @example
   * // Returns true
   * as.boolean({})
   *
   * @example
   * // Returns false
   * as.boolean(null)
   */
  boolean(value) {
    switch (String(value).toLowerCase()) {
      case "1":
      case "yes":
      case "true":
        return true;
      case "0":
      case "no":
      case "false":
        return false;
      default:
        return Boolean(value);
    }
  }
};
function createToolkit() {
  return { si, is, has, as };
}
function ifThenElse(condition, thenCase, elseCase) {
  if (typeof thenCase === "undefined" && typeof elseCase === "undefined")
    return !!condition;
  if (typeof thenCase === "undefined")
    thenCase = condition;
  if (condition) {
    if (is.function(thenCase))
      return thenCase();
    else
      return thenCase;
  } else {
    if (is.function(elseCase))
      return elseCase();
    else
      return elseCase;
  }
}

// src/utils/descriptor.utils.js
var DescriptorUtils = {
  /**
   * Creates an accessor descriptor object
   *
   * This function has multiple possible overloads
   *
   * ```markdown
   *   _**zeroFn** is a function that takes no parameters_
   *   _**oneFn** is a function that takes a single parameter_
   *   _**oneOrNone** is a either a function that takes a single parameter or nullish_
   *   _**nonFn** is any value that is not a function_
   *   _**nullish** is either null or undefined_
   *   _**...** means configurable?, enumerable?, storage?, key? liaison? as
   *   subsequent following parameters in that order_
   *
   *   **accessor()**
   *     creates a storage backed accessor that is both read and write.
   *     The storage object will be a provided empty object with the key
   *     being 'value'. Configurable and enumerable flags will be set to
   *     `true`.
   *
   *   **accessor(options)**
   *     this single argument variant of accessor() consists of a single
   *     options object. If neither `get` nor `set` are provided, a
   *     storage backed read-write accessor with undefined as the initial
   *     value will be constructed.
   *
   *   **accessor(nonFn)**
   *   **accessor(any, true, options?)**
   *   **accessor(any, true, ...)**
   *     supplying only a non-function only parameter or any value and the
   *     value `true` as the second parameter, you will get a read-write
   *     accessor stored in the default or specified storage. The resultant
   *     initial value will be whatever is provided as the first parameter.
   *     See options to customize `configurable`, `enumerable`, `storage`,
   *     `key` and the `liaison` factory function.
   *
   *   **accessor(any, false, options?)**
   *   **accessor(any, false, ...)**
   *     supplying only a non-function only parameter or any value and the
   *     value `false` as the second parameter, you will get a read-only
   *     getter stored in the default or specified storage. The resultant
   *     value will be whatever is provided as the first parameter.
   *     See options to customize `configurable`, `enumerable`, `storage`,
   *     `key` and the `liaison` factory function.
   *
   *   **accessor(zeroFn)**
   *   **accessor(zeroFn, nullish, options?)**
   *   **accessor(zeroFn, nullish, ...)**
   *     creates a generic read-only accessor with the first no-argument
   *     function parameter being the getter and either null or undefined
   *     for the setter. Either an options object or the manually ordered
   *     parameters can optionally follow if a nullish value for setter
   *     is provided.
   *
   *   **accessor(zeroFn, oneOrNone, options?)**
   *   **accessor(zeroFn, oneOrNone, ...)**
   *     creates a generic read-write accessor with the first no-argument
   *     function parameter being the getter and the second single-argument
   *     function parameter being the setter. Either an options object or
   *     the manually ordered parameters can optionally follow.
   *
   *   **accessor(oneFn, oneFn, options?)**
   *   **accessor(oneFn, oneFn, ...)**
   *     this special variant of the accessor() invocation, allows a single
   *     argument getter and setter factory to be supplied. These will
   *     automatically be invoked with the specified or default storage
   *     object. The result of the getter factory should be a no argument
   *     function. And the result of the setter factory should be a single
   *     argument function. The options for `liaison` and `key` will be
   *     ignored and should be handled specifically in the factory
   *     functions to suit your own use case.
   * ```
   *
   * Options are an object oriented way of supplying the alternate
   * flags to the data descriptor. They are
   *
   *   • `get` - only referenced when an options object is the only parameter
   *   • `set` - only referenced when an options object is the only parameter
   *   • `configurable` - if true, the descriptor of the object that this
   *     accessor descriptor represents can be redefined at later time by
   *     subsequent calls to {@link Object.defineProperty} or
   *     {@link Object.defineProperties}
   *   • `enumerable` - if true, enumeration over the object this
   *     descriptor is applied to, will show the property
   *     represented by this descriptor. See the associated MDN
   *     page regarding this {@link PropertyDescriptor} if you
   *     want to know more.
   *   • `storage` - an object, usually {@link Object} or {@link Map} or
   *     nullish if unused
   *   • `key` - a {@link PropertyKey} of your choosing or the default
   *      string `"value"`
   *   • `bind` - true if you wish to have the `storage` object bound as
   *     the `thisObj` for both the `get` and `set` functions when
   *     storage is used. **note* this will not work if you supply a
   *     big arrow function for the accessor function in question. This
   *     defaults to `false`.
   *   • `liaison` - an optional factory function that must return an
   *     object with two properties. The first is a `get()` function that
   *     returns a value and the second is a `set(value)` function that
   *     stores a value. The factory function receives `storage` and
   *     `key`, in that order. The default uses {@link Map.get} and
   *     {@link Map.set} if the storage is an instance of {@link Map}.
   *     Otherwise, the typical `object[key]` format is used if the
   *     storage object is an instanceof {@link Object}
   *
   * @param {(object|any)?} value the JavaScript value representing
   * this descriptor's value or an options object if it is the
   * only parameter.
   * @param {(object|boolean)?} optionsOrConfigurable true or false if
   * you wish the `configurable` flag to be set. Optionally supply an
   * object with one of the supported options to configure the run
   * of the function.
   * @param {boolean?} enumerable true or false if you wish to
   * configure the `.enumerable` property of the descriptor
   * @param {object?} storage an object upon which data storage should
   * be written to and read from. Defaults to an empty {@link Object}
   * when storage is needed and not supplied via this parameter or
   * an options object.
   * @param {PropertyKey?} key the key used to store content on the
   * storage object.
   * @param {(object, PropertyKey) => { get: ()=>any, set: (v)=>void}} liaison
   * an optional function that, given a storage object and property key,
   * returns an object with a no argument `get()` function that returns
   * the value on the storage object with a given key and a single argument
   * `set(value)` function that stores a new value using the property key
   * on the supplied storage object. This exists because access to a
   * {@link Map} and {@link Object} values are handled differently. If you
   * need support for some other class than `Map` or `Object` then you
   * should provide a liaison function to define access.
   *
   * @returns {PropertyDescriptor}
   *
   * @see {@link PropertyDescriptor}
   * @note More info on this can be found at the
   * [MDN Object.defineProperty/ies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
   * page
   *
   * @type {Function & { keys: string[] }}
   */
  get accessor() {
    function accessor2(get, set, optionsOrConfigurable = true, enumerable = true, storage, key = "value", liaison) {
      const count = arguments.length;
      const storageKeys = ["storage", "key", "liaison", "initial", "bind"];
      const optionKeys = [
        // accessor functions
        "get",
        "set",
        // descriptor flags
        "configurable",
        "enumerable",
        // storage configuration keys
        ...storageKeys
      ];
      const has3 = (object, key2) => isObject(object) && Reflect.has(object, key2);
      const isOpts = (object) => optionKeys.some((key2) => has3(object, key2));
      let configurable = !!optionsOrConfigurable;
      let initial = void 0;
      let bind = false;
      let options = {};
      if (count === 1 && isObject(get) && hasSome(get, ...optionKeys)) {
        options = { ...get };
        ({ get, set } = get);
      }
      if (isObject(optionsOrConfigurable) || isObject(set)) {
        options = isObject(set) && count === 2 ? { ...set } : { ...optionsOrConfigurable };
        ({ configurable, enumerable, storage, key, bind, initial } = options);
      }
      liaison = options?.liaison ?? liaison ?? ((storage2, key2) => ({
        get() {
          if (storage2 instanceof Map)
            return storage2.get(key2);
          else if (isObject(storage2))
            return storage2[key2];
        },
        set(value) {
          if (storage2 instanceof Map)
            storage2.set(key2, value);
          else if (isObject(storage2))
            storage2[key2] = value;
        }
      }));
      configurable = configurable ?? true;
      enumerable = enumerable ?? true;
      key = key ?? "value";
      bind = bind ?? false;
      const nullish = (value) => value === null || value === void 0;
      const nonFn = (value) => !nullish(value) && typeof value !== "function";
      const yesFn = (value) => typeof value === "function";
      const zeroFn = (value) => yesFn(value) && value.length === 0;
      const oneFn = (value) => yesFn(value) && value.length === 1;
      const isTrue = (value) => value === true;
      const isFalse = (value) => value === false;
      const addRefs = (fn, value) => Object.defineProperties(fn, {
        storage: { value, configurable: true, enumerable: false },
        key: { value: key, configurable: true, enumerable: false }
      });
      if (count === 0 || !get && !set) {
        storage = { [key]: initial };
        const _ = liaison(storage, key);
        get = addRefs(function() {
          return _.get();
        }, storage);
        set = addRefs(function(value) {
          _.set(value);
        }, storage);
        return { get, set, configurable, enumerable };
      }
      if (count === 1 && oneFn(get)) {
        set = false;
      }
      if (count === 1 && nonFn(get) || (isTrue(set) || isFalse(set))) {
        const skipSet = isFalse(set);
        if (!storage || !(storage instanceof Map) || !isObject(storage)) {
          storage = {};
        }
        const _ = liaison(storage, key);
        _.set(get);
        let _get = function() {
          return _.get();
        };
        let _set = function(value) {
          _.set(value);
        };
        if (bind) {
          _get = _get.bind(storage);
          _set = _set.bind(storage);
        }
        get = addRefs(_get, storage);
        set = addRefs(_set, storage);
        if (skipSet) {
          set = void 0;
        }
        return { get, set, configurable, enumerable };
      }
      if (zeroFn(get) && !set || zeroFn(get) && oneFn(set)) {
        const descriptor = { get, set, configurable, enumerable };
        if (isObject(options) && Reflect.has(options, "initial"))
          descriptor.set(initial);
        return descriptor;
      }
      if (oneFn(get) && oneFn(set)) {
        storage = storage || {};
        let _get = get(storage);
        let _set = set(storage);
        if (bind) {
          _get = _get.bind(storage);
          _set = _set.bind(storage);
        }
        return {
          get: addRefs(_get, storage),
          set: addRefs(_set, storage),
          configurable,
          enumerable
        };
      }
      return { get, set, configurable, enumerable };
    }
    Object.defineProperty(accessor2, "keys", {
      get() {
        return Object.defineProperties(
          ["get", "set", "configurable", "enumerable"],
          {
            from: {
              value: function extractKeysFrom(object) {
                const response = {
                  get: void 0,
                  set: void 0,
                  configurable: void 0,
                  enumerable: void 0
                };
                if (!object || !(object instanceof Object))
                  return response;
                for (const key of DescriptorUtils.accessor.keys) {
                  if (Reflect.has(object, key))
                    response[key] = object[key];
                }
              },
              writable: false,
              configurable: false,
              enumerable: false
            }
          }
        );
      },
      configurable: true,
      enumerable: false
    });
    return accessor2;
  },
  /**
   * Creates a data descriptor object
   *
   * This function has multiple possible overloads
   *
   * ```markdown
   *   **data()**
   *     creates a data descriptor with a value of `undefined` that
   *     is writable, configurable and enumerable.
   *
   *   **data(options)**
   *     if the only parameter is an object and that object contains
   *     at least a `.value` property, this funtion will return a
   *     data descriptor with the associated values. This variant
   *     is useful if you want to extract the normal data descriptor
   *     properties: value, writable, configurable and/or enumerable
   *     from an object that has properties with these names, in
   *     addition to other properties or functions. Note that if you
   *     wish for the value of the descriptor to be an object that
   *     also contains a `.value` property, use `data({value: obj})`
   *     instead.
   *
   *   **data(value)**
   *   **data(value, options?)**
   *     creates a data descriptor from the supplied `value`,
   *     optionally augmented by additional `options`. The defaults
   *     for this writable, configurable and enumerable values set
   *     to `true`
   *
   *   **data(value, writable?, configurable?, enumerable?)**
   *     if writable, configurable or enumerable or true or false
   *     then this function creates a data descriptor with those
   *     flags and the supplied value (there's no real reason to
   *     invoke this function if you're supplying all four values)
   * ```
   *
   * Options are an object oriented way of supplying the alternate
   * flags to the data descriptor. They are
   *
   *   • `value` - only referenced when an options object is the
   *     only parameter
   *   • `writable` - true if the value represented by this data
   *     descriptor can be reassigned a new value.
   *   • `configurable` - if true, the descriptor of the object
   *     that this data descriptor represents can be redefined at
   *     later time by subsequent calls to `Object.defineProperty`
   *     or `Object.defineProperties`. If `.configurable` is true
   *     this can be done even if `.writable` is set to false
   *   • `enumerable` - if true, enumeration over the object this
   *     descriptor is applied to, will show the property
   *     represented by this descriptor. See the associated MDN
   *     page regarding this `PropertyDescriptor` if you want to
   *     know more.
   *
   * @param {(object|any)?} value the JavaScript value representing
   * this descriptor's value or an options object if it is the
   * only parameter.
   * @param {(object|boolean)?} optionsOrWritable true or false if
   * you wish the writable flag to be set. Optionally supply an
   * object with one of the supported options to configure the run
   * of the function.
   * @param {boolean?} configurable true or false if you wish to
   * configure the `.configurable` property of the descriptor
   * @param {boolean?} enumerable true or false if you wish to
   * configure the `.enumerable` property of the descriptor
   * @returns {PropertyDescriptor}
   *
   * @note More info on this can be found at the
   * [MDN Object.defineProperty/ies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
   * page
   *
   * @type {Function & { keys: string[] }}
   */
  get data() {
    function data2(value, optionsOrWritable, configurable, enumerable) {
      const count = arguments.length;
      let valueIsDescriptor = false;
      if (count === 0) {
        return {
          value: void 0,
          writable: true,
          configurable: true,
          enumerable: true
        };
      }
      if (count === 1) {
        const stats = DescriptorUtils.isDescriptor(value, true);
        if (stats.isValid && stats.isData) {
          valueIsDescriptor = true;
        }
      }
      let writable = optionsOrWritable === void 0 ? true : !!optionsOrWritable;
      let options = typeof optionsOrWritable === "boolean" ? {} : Object(optionsOrWritable);
      configurable = configurable === void 0 ? true : !!configurable;
      enumerable = enumerable === void 0 ? true : !!enumerable;
      if (valueIsDescriptor && !options?.allowDescriptorValue) {
        options = {
          writable: value?.writable ?? true,
          configurable: value?.configurable ?? true,
          enumerable: value?.enumerable ?? true
        };
        value = value?.value;
      }
      if (options) {
        ({ writable, configurable, enumerable } = {
          ...{ writable, configurable, enumerable },
          ...options
        });
      }
      return { value, writable, configurable, enumerable };
    }
    Object.defineProperty(data2, "keys", {
      value: Object.defineProperties(
        ["value", "writable", "configurable", "enumerable"],
        {
          from: {
            value: function extractKeysFrom(object) {
              const response = {
                value: void 0,
                writable: void 0,
                configurable: void 0,
                enumerable: void 0
              };
              if (!object || !(object instanceof Object))
                return response;
              for (const key of DescriptorUtils.data.keys) {
                if (Reflect.has(object, key))
                  response[key] = object[key];
              }
            },
            writable: false,
            configurable: false,
            enumerable: false
          }
        }
      ),
      writable: false,
      configurable: true,
      enumerable: false
    });
    return data2;
  },
  describe(object, key, value, detectDescriptorValues = true) {
    const { isAccessor: isAccessor2, isData: isData2, data: data2 } = DescriptorUtils;
    if (!(object && object instanceof Object))
      return void 0;
    if (!["string", "number", "symbol"].includes(typeof key))
      return void 0;
    if (detectDescriptorValues && isAccessor2(value) || isData2(value)) {
      return Object.defineProperty(object, key, value);
    } else {
      return Object.defineProperty(object, key, data2(value));
    }
  },
  describeMany(object, keyValues, detectDescriptorValues = true) {
    const { isAccessor: isAccessor2, isData: isData2, isDescriptor: isDescriptor2, data: data2, describe: describe2 } = DescriptorUtils;
    const isKey = (k) => ["string", "number", "symbol"].includes(typeof k);
    let map2 = void 0;
    if (Array.isArray(keyValues)) {
      map2 = new Map(keyValues.filter((keyValue) => {
        return typeof keyValue === "function" && keyValue.length === 2;
      }));
    } else if (keyValues instanceof Map) {
      map2 = keyValues;
    } else if (keyValues instanceof Object) {
      const descriptors = Object.getOwnPropertyDescriptors(keyValues);
      map2 = new Object.entries(descriptors);
    } else {
      return [];
    }
    for (const [key, value] of map2) {
      if (detectDescriptorValues) {
        if (isDescriptor2(key)) {
        }
      }
    }
    const accessorBase = { enumerable: true, configurable: true };
    const dataBase = { writable: true, ...accessorBase };
    const extractBase = (descriptor) => {
      if (isAccessor2(descriptor)) {
        const { configurable, enumerable } = descriptor;
        return { configurable, enumerable };
      } else if (isData2(descriptor)) {
        const { writable, configurable, enumerable } = descriptor;
        return { writable, configurable, enumerable };
      }
      return void 0;
    };
    for (const [key, value] of map2.entries()) {
      const descriptor = detectDescriptorValues && isDescriptor2(value) ? value : data2(value, dataBase);
    }
  },
  extract(fromObject, keysToExtract, defaultIfMissing = void 0, extractDescriptors = false) {
    const { data: data2 } = DescriptorUtils;
    const output = {};
    if (!fromObject || typeof fromObject !== "object")
      return output;
    if (!Array.isArray(keysToExtract))
      keysToExtract = [keysToExtract];
    for (const key of keysToExtract) {
      let descriptor = Object.getOwnPropertyDescriptor(fromObject, key);
      if (!descriptor)
        descriptor = data2(defaultIfMissing);
      if (extractDescriptors)
        descriptor.value = data2(descriptor, { allowDescriptorValue: true });
      Object.defineProperty(output, key, descriptor);
    }
    return output;
  },
  /**
   * Determines if a given value is an accessor descriptor.
   *
   * An accessor descriptor is a property descriptor that defines
   * getter and/or setter functions for a property. This function
   * checks the validity of the descriptor and whether it qualifies
   * as an accessor.
   *
   * @param {Object} value - The descriptor object to evaluate.
   * @param {boolean} [strict=true] - If true, performs a strict
   *   validation of the descriptor.
   * @returns {boolean} Returns true if the descriptor is valid and
   *   is an accessor descriptor, otherwise false.
   *
   * @example
   * // Example usage:
   * const descriptor = { get: () => 42, set: (val) => {} }
   * const result = DescriptorUtils.isAccessor(descriptor)
   * console.log(result) // Outputs: true
   */
  isAccessor(value, strict = true) {
    const stats = DescriptorUtils.isDescriptor(value, true, strict);
    return stats.isValid && stats.isAccessor;
  },
  /**
   * Checks if a given value is a data descriptor.
   *
   * A data descriptor is a property descriptor that defines a value
   * and optionally a writable attribute for a property. This function
   * evaluates the descriptor's validity and whether it qualifies as
   * a data descriptor.
   *
   * @param {Object} value - The descriptor object to evaluate.
   * @param {boolean} [strict=true] - If true, performs a strict
   *   validation of the descriptor.
   * @returns {boolean} Returns true if the descriptor is valid and
   *   is a data descriptor, otherwise false.
   *
   * @example
   * // Example usage:
   * const descriptor = { value: 42, writable: true }
   * const result = DescriptorUtils.isData(descriptor)
   * console.log(result) // Outputs: true
   */
  isData(value, strict = true) {
    const stats = DescriptorUtils.isDescriptor(value, true, strict);
    return stats.isValid && stats.isData;
  },
  /**
   * A function that, given a value that might be a `PropertyDescriptor`,
   * calculates a deterministic probability that the supplied value is
   * an object that either is a `PropertyDescriptor` or that can function
   * as one.
   *
   * @param {unknown} value a JavaScript value that might be a
   * `PropertyDescriptor` type.
   * @param {boolean?} returnStats if this value is true, instead of returning
   * a determined boolean value indicating the supplied value might be a
   * `PropertyDescriptor`, an object containing the determined flags and score
   * the led to the determination instead is returned.
   * @param {boolean?} strict if this value is `true`, which is the default,
   * then the function will not allow descriptor compatible objects, rather it
   * will only return true if the object has keys that belong in a descriptor
   * and do not form an invalid combination.
   * @returns {IsDescriptorResponse} if `returnStats` is `true`
   * an object of type {@link IsDescriptorStats} is returned. This object
   * will have a lot of {@link Boolean} flags pertaining to the `true`/`false`
   * evaluation. If `returnStats` is `false`, then a boolean value denoting
   * whether or not the value is a {@link PropertyDescriptor} is returned
   * instead. This is effectively the same as the `isValid` parameter from the
   * stats block.
   */
  isDescriptor(value, returnStats = false, strict = true) {
    const areBools = (...props) => props.flat().every(
      (prop) => boolTypes.includes(typeof value[prop])
    );
    const areFuncs = (...props) => props.flat().every(
      (prop) => funcTypes.includes(typeof value[prop])
    );
    const hasKeyFn = (property2) => Reflect.has(value, property2);
    const isOfType = (type) => (element) => typeof element === type;
    const baseProps = ["configurable", "enumerable"];
    const dataProps = ["value", "writable"];
    const accessorProps = ["get", "set"];
    const anyDescProps = [...baseProps, ...dataProps, ...accessorProps];
    const boolTypes = ["undefined", "boolean"];
    const funcTypes = ["undefined", "function"];
    const stats = {
      confidence: 0,
      hasAccessorKeys: false,
      hasBaseDescriptorKeys: false,
      hasDataKeys: false,
      isAccessor: false,
      isData: false,
      isValid: false,
      isBase: false
    };
    if (!value || typeof value !== "object" || !(value instanceof Object))
      return returnStats ? stats : false;
    let score = 0;
    if (value && typeof value === "object") {
      const objKeys = Reflect.ownKeys(value);
      const nonDescKeys = objKeys.filter((k) => !anyDescProps.includes(k));
      if (strict && nonDescKeys.length)
        return false;
      if (objKeys.length <= 4)
        score++;
      stats.hasAccessorKeys = accessorProps.some(hasKeyFn) && areFuncs(accessorProps);
      stats.hasDataKeys = dataProps.some(hasKeyFn) && areBools("writable");
      stats.hasBaseDescriptorKeys = baseProps.some(hasKeyFn) && areBools(baseProps);
      if (stats.hasBaseDescriptorKeys)
        score++;
      if (stats.hasAccessorKeys || stats.hasDataKeys)
        score++;
      if (score > 0)
        stats.isValid = true;
      if (score > 0 && stats.hasAccessorKeys)
        stats.isAccessor = true;
      if (score > 0 && stats.hasDataKeys)
        stats.isData = true;
      if (stats.isValid && !["get", "set", "value"].some(hasKeyFn))
        stats.isBase = true;
      if (stats.isValid && stats.isData && Reflect.has(value, "value"))
        score++;
      else if (stats.isValid && stats.isAccessor) {
        if ([value?.get, value?.set].some(isOfType("function")))
          score++;
      }
      if (stats.hasAccessorKeys && stats.hasDataKeys) {
        score = 0;
        stats.isValid = false;
      }
      stats.confidence = parseFloat(score / 4);
    }
    if (returnStats)
      return stats;
    return score >= 0 ? true : false;
  },
  /**
   * Redefines a property on an object with new descriptors and options.
   * This function allows renaming, aliasing, and redefining property
   * descriptors such as configurable, enumerable, writable, get, and set.
   *
   * @param {Object} object - The target object whose property is to be
   * redefined.
   * @param {string|symbol} key - The key of the property to redefine.
   * @param {Object} as - An object containing new property descriptors.
   * @param {Object} [options] - Optional settings for renaming and aliasing.
   * @param {string|symbol} [options.rename] - New key name for the property.
   * @param {Array<string|symbol>} [options.alsoAs] - Additional aliases for
   * the property.
   * @param {Object} [options.moveTo] optionally move the descriptor from this
   * object to another.
   * @returns {any} the result of `object[key]` in its final state
   *
   * @example
   * const obj = { a: 1 }
   * redescribe(obj, 'a', { writable: false }, { rename: 'b', alsoAs: ['c'] })
   * console.log(obj.b) // Outputs: 1
   * console.log(obj.c) // Outputs: 1
   */
  redescribe(object, key, as2, options) {
    const { isAccessor: isAccessor2, isData: isData2 } = DescriptorUtils;
    const ifThen = (condition, fn, ...args) => condition && fn(...args);
    const isBool = (value) => typeof value === "boolean" || value instanceof Boolean;
    const isFunction = (value) => typeof value === "function";
    const isObject2 = (value) => value && value instanceof Object;
    const isDefined = (value, key2) => isObject2(value) && Reflect.has(value, key2);
    const isObjectKey = (v) => ["string", "number", "symbol"].includes(typeof v);
    const define = (key2, values) => Object.defineProperty(object, key2, values);
    const assign = (object2, ...values) => Object.assign(object2, ...values);
    const isAnObject = isObject2(object);
    let asIsObject = isObject2(as2);
    const descriptor = isAnObject && Object.getOwnPropertyDescriptor(object, key);
    const aliases = [];
    if (descriptor && !asIsObject) {
      asIsObject = true;
      as2 = {};
    }
    if (isObject2(options)) {
      if (isDefined(options, "rename")) {
        const successfulDelete = delete object[key];
        if (successfulDelete)
          key = options.rename;
      }
      if (isDefined(options, "alsoAs")) {
        if (Array.isArray(options.alsoAs)) {
          for (const value of options.alsoAs.filter((v) => isObjectKey(v)))
            aliases.push(value);
        } else if (isObjectKey(options.alsoAs)) {
          aliases.push(options.alsoAs);
        }
      }
      if (isDefined(options, "moveTo")) {
        ifThen(isObject2(options.moveTo), () => object = options.moveTo);
      }
    }
    if (isAnObject && asIsObject) {
      let { configurable, enumerable, writable, get, set, value } = as2;
      if (isAccessor2(descriptor)) {
        ifThen(isFunction(get), () => assign(descriptor, { get }));
        ifThen(isFunction(set), () => assign(descriptor, { set }));
      }
      ifThen(isBool(writable) && isData2(descriptor), () => {
        assign(descriptor, {
          writable,
          value: isDefined(as2, "value") ? value : descriptor.value
        });
      });
      ifThen(isBool(configurable), () => assign(descriptor, { configurable }));
      ifThen(isBool(enumerable), () => assign(descriptor, { enumerable }));
      define(key, descriptor);
      for (const alias of aliases) {
        define(alias, descriptor);
      }
      return object[key];
    }
  },
  /**
   * Retrieves the keys associated with accessor descriptors.
   *
   * Accessor descriptors are property descriptors that define
   * getter and/or setter functions for a property.
   *
   * @type {string[]}
   *
   * @example
   * // Example usage:
   * const keys = DescriptorUtils.kAccessorDescriptorKeys
   * console.log(keys) // Output: ['get', 'set']
   */
  get kAccessorDescriptorKeys() {
    return ["get", "set"];
  },
  /**
   * Retrieves the keys associated with data descriptors.
   *
   * Data descriptors are property descriptors that define a value
   * and optionally a writable attribute for a property.
   *
   * @type {string[]}
   *
   * @example
   * // Example usage:
   * const keys = DescriptorUtils.kDataDescriptorKeys
   * console.log(keys) // Output: ['value', 'writable']
   */
  get kDataDescriptorKeys() {
    return ["value", "writable"];
  },
  /**
   * Retrieves the keys associated with shared descriptors.
   *
   * Shared descriptors are property descriptors that define
   * common attributes for a property, such as whether the
   * property is configurable or enumerable.
   *
   * @type {string[]}
   *
   * @example
   * // Example usage:
   * const keys = DescriptorUtils.kSharedDescriptorKeys
   * console.log(keys) // Output: ['configurable', 'enumerable']
   */
  get kSharedDescriptorKeys() {
    return ["configurable", "enumerable"];
  },
  /**
   * Retrieves all descriptor keys, combining accessor, data, and shared
   * descriptor keys.
   *
   * This getter method aggregates keys from accessor descriptors,
   * data descriptors, and shared descriptors into a single array.
   * This can be useful when you need to validate or inspect all
   * possible descriptor keys.
   *
   * @type {string[]}
   *
   * @example
   * // Example usage:
   * const allKeys = DescriptorUtils.kDescriptorKeys
   * console.log(allKeys)
   * // Output: [
   * //   'get', 'set', 'value', 'writable', 'configurable', 'enumerable'
   * // ]
   */
  get kDescriptorKeys() {
    return [
      ...this.kAccessorDescriptorKeys,
      ...this.kDataDescriptorKeys,
      ...this.kSharedDescriptorKeys
    ];
  }
};
var {
  accessor,
  data,
  describe,
  describeMany,
  extract,
  isDescriptor,
  isAccessor,
  isData,
  redescribe
} = DescriptorUtils;
var {
  kAccessorDescriptorKeys,
  kDataDescriptorKeys,
  kDescriptorKeys,
  kSharedDescriptorKeys
} = DescriptorUtils;
function isObject(o) {
  return o && typeof o === "object";
}
function hasSome(object, ...keys) {
  return hasQuantity("some", object, keys);
}
function hasQuantity(quantityFn, object, keys) {
  return isObject(object) && keys.flat(Infinity).map((key) => Reflect.has(object, key))[quantityFn]((has3) => has3);
}

// src/utils/index.js
var index_default = {
  COPropertyHandler,
  FlexiblyHiddenHandler,
  FlexiblyVisibleHandler,
  ImmutablyHiddenHandler,
  ImmutablyVisibleHandler,
  MutablyHiddenHandler,
  MutablyVisibleHandler,
  StdoutGlobalPatches,
  StringConsole,
  VisibilityKeys,
  VisibilityScopeHandler,
  as,
  has,
  is,
  si,
  accessor,
  captureStdout,
  copyObject,
  createToolkit,
  customCopyObject,
  data,
  describe,
  describeMany,
  extract,
  isDescriptor,
  makeTransducer,
  redescribe,
  transduceFrom,
  transduceFromCOHandler,
  tryIgnore,
  kAccessorDescriptorKeys,
  kDataDescriptorKeys,
  kDescriptorKeys,
  kVisibilityKeys
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  COPropertyHandler,
  DescriptorUtils,
  FlexiblyHiddenHandler,
  FlexiblyVisibleHandler,
  ImmutablyHiddenHandler,
  ImmutablyVisibleHandler,
  MutablyHiddenHandler,
  MutablyVisibleHandler,
  SC,
  StdoutGlobalPatches,
  StringConsole,
  StringConsoleExtension,
  VisibilityKeys,
  VisibilityScopeHandler,
  accessor,
  as,
  captureStdout,
  copyObject,
  createToolkit,
  customCopyObject,
  data,
  describe,
  describeMany,
  extract,
  has,
  is,
  isAccessor,
  isData,
  isDescriptor,
  kAccessorDescriptorKeys,
  kDataDescriptorKeys,
  kDescriptorKeys,
  kSharedDescriptorKeys,
  kVisibilityKeys,
  makeTransducer,
  redescribe,
  si,
  transduceFrom,
  transduceFromCOHandler,
  tryIgnore
});
//# sourceMappingURL=index.cjs.map
