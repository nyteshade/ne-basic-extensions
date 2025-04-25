"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StdoutGlobalPatches = exports.StringConsoleExtension = exports.SC = exports.StringConsole = void 0;
exports.captureStdout = captureStdout;
const extension_1 = require("@nejs/extension");
/**
 * Captures the output written to `process.stdout` during the execution of
 * a callback function. This function temporarily overrides the standard
 * output stream to capture any data written to it, allowing for inspection
 * or testing of console output.
 *
 * @param {Function|*} callback - The function to execute, during which
 *   `process.stdout` is captured. If not a function, it will be treated
 *   as the first argument to a console log.
 * @param {Array} [args=[]] - Arguments to pass to the callback function.
 * @param {Object} [thisArg=console] - The value of `this` provided for
 *   the call to `callback`.
 * @returns {string} The captured output from `process.stdout`.
 *
 * @example
 * const output = captureStdout(() => {
 *   console.log('Hello, World!')
 * })
 * console.log(output) // Outputs: 'Hello, World!'
 *
 * @description
 * This function is useful for testing or capturing console output without
 * displaying it in the terminal. It works by temporarily replacing
 * `process.stdout.write` with a custom function that appends output to a
 * string. After the callback is executed, the original `process.stdout.write`
 * is restored.
 */
function captureStdout(callback, args = [], thisArg = console) {
    let captured = '';
    const originalWrite = process.stdout.write;
    if (typeof callback !== 'function') {
        let newArgs = [callback];
        if (thisArg) {
            newArgs.push(thisArg);
        }
        newArgs = newArgs.concat(args);
        callback = function () {
            console.log(...newArgs);
        };
        thisArg = console;
        args = [];
    }
    process.stdout.write = (chunk, encoding, callback) => {
        captured += chunk;
    };
    try {
        callback.apply(thisArg, args);
    }
    finally {
        process.stdout.write = originalWrite;
    }
    return captured.substring(0, captured.length - 1);
}
/**
 * A class that simulates a console for capturing and manipulating console
 * output as strings. This class provides methods to log messages, format
 * them with colors, and store them in a buffer for later inspection or
 * manipulation.
 *
 * @example
 * const stringConsole = new StringConsole()
 * stringConsole.log('Hello, World!')
 * stringConsole.buffer // ['Hello, World!']
 *
 * @description
 * The StringConsole class is designed to capture console output without
 * displaying it in the terminal. It stores the output in a buffer, allowing
 * for easy retrieval and manipulation. This is particularly useful for
 * testing or when console output needs to be processed programmatically.
 */
class StringConsole {
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
    recorder = Object.defineProperty(function recorder(chunk, encoding, callback) { this.buffer.push(chunk); }, Symbol.for(`StringConsole.recorder`), { value: true, configurable: true });
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
    constructor(captureOutput = true, initialContents = undefined) {
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
        return Reflect.has(process.stdout.write, Symbol.for('StringConsole.recorder'));
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
        process.stdout.write = this.recorder;
        process.stderr.write = this.recorder;
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
        process.stdout.write = StringConsole[Symbol.for('process.stdout.write')];
        process.stderr.write = StringConsole[Symbol.for('process.stderr.write')];
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
    toString(joinOn = '') {
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
        args = this.constructor.colorArgs('debug', args);
        this.startCapture();
        console.debug(...args);
        return this.stopCapture().lines.join('\n');
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
        args = this.constructor.colorArgs('error', args);
        this.startCapture();
        console.error(...args);
        return this.stopCapture().lines.join('\n');
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
        const commands = ['log', 'info', 'warn', 'error', 'debug', 'trace'];
        const buffer = [];
        invocations = invocations.filter(i => commands.includes(i?.[0]));
        if (groupName)
            groupName = this.constructor.style(groupName, ['underline', 'bold']);
        else
            groupName = this.constructor.style('grouped', ['underline', 'bold']);
        this.startCapture();
        console.group(groupName);
        for (const invocation of invocations) {
            if (!Array.isArray(invocation) || invocation.length < 2)
                continue;
            const [level, ...args] = invocation;
            console[level](...this.constructor.colorArgs(level, args));
        }
        console.groupEnd(groupName);
        return this.stopCapture().lines.join('');
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
        args = this.constructor.colorArgs('info', args);
        this.startCapture();
        console.info(...args);
        return this.stopCapture().lines.join('\n');
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
        args = this.constructor.colorArgs('log', args);
        this.startCapture();
        console.log(...args);
        return this.stopCapture().lines.join('\n');
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
        args = this.constructor.colorArgs('trace', args);
        this.startCapture();
        console.trace(...args);
        return this.stopCapture().lines.join('\n');
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
        args = this.constructor.colorArgs('warn', args);
        this.startCapture();
        console.warn(...args);
        return this.stopCapture().lines.join('\n');
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
    static #console = new StringConsole(false);
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
    static colors = new Map([
        ['black', [0, 9]],
        ['red', [1, 9]],
        ['green', [2, 9]],
        ['yellow', [3, 9]],
        ['blue', [4, 9]],
        ['magenta', [5, 9]],
        ['cyan', [6, 9]],
        ['white', [7, 9]]
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
    static levels = Object.defineProperties(new Map([
        ['log', ['white']],
        ['info', ['cyan']],
        ['warn', ['yellow']],
        ['error', ['red']],
        ['trace', ['magenta']],
        ['debug', ['bold', 'yellow']]
    ]), {
        color: {
            value: function color(key) {
                for (const value of this.get(key)) {
                    if (StringConsole.colors.has(value)) {
                        return StringConsole.colors.get(value);
                    }
                }
                return StringConsole.colors.get('white');
            },
            configurable: true,
        },
        styles: {
            value: function styles(key) {
                const styles = [];
                for (const value of this.get(key)) {
                    if (StringConsole.styles.has(value)) {
                        styles.push(StringConsole.styles.get(value));
                    }
                }
                return styles;
            },
            configurable: true,
        },
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
    static pens = new Map([
        ['foreground', [3, 3]],
        ['background', [4, 4]],
        ['bright.foreground', [9, 3]],
        ['bright.background', [10, 4]]
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
    static styles = new Map([
        ['reset', ['\x1b[0m']],
        ['blink', ['\x1b[5m', '\x1b[25m']],
        ['bold', ['\x1b[1m', '\x1b[22m']],
        ['conceal', ['\x1b[8m', '\x1b[28m']],
        ['dim', ['\x1b[2m', '\x1b[22m']],
        ['italics', ['\x1b[3m', '\x1b[23m']],
        ['negative', ['\x1b[7m', '\x1b[27m']],
        ['strike', ['\x1b[9m', '\x1b[29m']],
        ['underline', ['\x1b[4m', '\x1b[24m']]
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
        level: undefined,
        color: undefined,
        pen: 'foreground',
        rgb8: undefined,
        rgb24: [186, 186, 186],
        styles: [],
        buffer: [],
        before: [],
        after: [],
    }) {
        const { colors: Colors, styles: Styles, pens: Pens, levels: Levels } = this;
        let useColors = undefined;
        let useRGB = false;
        let styles = [];
        const pens = this.pens.get(options?.pen ?? 'foreground');
        const [p0, p1] = pens;
        if (options?.styles) {
            if (Array.isArray(options.styles))
                styles = options.styles
                    .filter(s => Styles.has(s))
                    .map(s => Styles.get(s));
            else if (typeof options.styles === 'string' && Styles.has(options.styles))
                styles = Styles.get(options.styles);
        }
        if (options?.level && Levels.has(options.level)) {
            useColors = Levels.color(options.level);
            const addlStyles = Levels.styles(options.level);
            if (addlStyles.length)
                styles = styles.concat(addlStyles);
        }
        else if (options?.color && Colors.has(options.color))
            useColors = Colors.get(options.color);
        else if (options?.rgb24 && Array.isArray(options.rgb24)) {
            useColors = [`\x1b[${p0}8;2;${options.rgb24.join(';')};m`, `\x1b[${p1}9m`];
            useRGB = true;
        }
        else if (options?.rgb8 && typeof options.rgb8 === 'number') {
            useColors = [`\x1b[${p0}8;5;${options.rgb8}m`, `\x1b[${p1}9m`];
            useRGB = true;
        }
        else
            useColors = [9, 9];
        const [c0, c1] = (useRGB
            ? useColors
            : useColors?.map((c, i) => `\x1b[${pens[i]}${c}m`) ?? [`\x1b[39;49m`]);
        if (this.hasColor(string))
            return string;
        if (typeof string !== 'string')
            return string;
        if (string instanceof String)
            (string = String(string));
        if (!useColors)
            return string;
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
        return [...buffer, before.join(''), string, after.join('')].join('');
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
        if (args === null || args === undefined || !Array.isArray(args))
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
        return string.includes('\x1b[');
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
        if (typeof styles === 'string' && this.styles.has(styles)) {
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
        return [before.join(''), string, after.join('')].join('');
    }
    /* Since this class captures the swaps the process.stdout.write function,
     * in to and out of place repeatedly, we want to avoid any possible issues
     * where this conflict could be problematic. To this end, we capture the
     * global process.stdout.write function as a copy when this class is defined
     * but before it is used.
     *
     * If no other code modifies the `writer` property, this is created as a
     * non-enumerable alias to the [Symbol.for('process.stdout.write')] symbol
     * the actual function is stored in.
     */
    static {
        Object.defineProperties(StringConsole, {
            [Symbol.for('process.stdout.write')]: {
                value: Object.defineProperties(process.stdout.write, {
                    [Symbol.for('original')]: { value: true, configurable: true },
                    isOriginal: { get() { return true; }, configurable: true },
                }),
                configurable: true,
            },
            [Symbol.for('process.stderr.write')]: {
                value: Object.defineProperties(process.stderr.write, {
                    [Symbol.for('original')]: { value: true, configurable: true },
                    isOriginal: { get() { return true; }, configurable: true },
                }),
                configurable: true,
            },
        });
        if (!Reflect.has(StringConsole, 'writer')) {
            Object.defineProperties(StringConsole, {
                writer: {
                    value: StringConsole[Symbol.for('process.stdout.write')],
                    configurable: true,
                },
                errorWriter: {
                    value: StringConsole[Symbol.for('process.stderr.write')],
                    configurable: true,
                },
            });
        }
    }
}
exports.StringConsole = StringConsole;
exports.SC = StringConsole;
exports.StringConsoleExtension = new extension_1.Extension(StringConsole);
exports.StdoutGlobalPatches = new extension_1.Patch(globalThis, {
    [extension_1.Patch.kMutablyHidden]: {
        captureStdout,
    }
});
exports.default = {
    SC: StringConsole,
    StringConsole,
    StringConsoleExtension: exports.StringConsoleExtension,
    StdoutGlobalPatches: exports.StdoutGlobalPatches,
    captureStdout,
};
//# sourceMappingURL=stdout.js.map