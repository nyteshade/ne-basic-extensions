#!/usr/bin/env node --no-warnings --no-deprecations

// Import everything for playtesting.
(await import('./dist/mjs/index.js')).Controls.enableAll();

const nejsExtension = await import('@nejs/extension');

const repl = await import('node:repl');
const fs = await import('node:fs');
const project = JSON.parse(String(fs.readFileSync('./package.json')));

const options = {
  useGlobal: true,
  prompt: '\x1b[32mλ\x1b[1;39m\x1b[22m '
};

let allowInvocation = true;

Object.assign(global, { Patch: nejsExtension.Patch, Extension: nejsExtension.Extension });
global.replServer = new repl.REPLServer(options);

function about() {
  console.log(`\x1b[32m${project.name}\x1b[39m v\x1b[1m${project.version}\x1b[22m`);
  console.log(`\x1b[3m${project.description}\x1b[23m`);
  console.log(`Written by \x1b[34m${project.author ?? 'Jane Doe'}\x1b[39m.\n`);
  this?.displayPrompt() ?? replServer.displayPrompt();
}

const clear = () => {
  if (allowInvocation) {
    process.stdout.write('\x1b[0;0H\x1b[J');
    return about();
  }
}

clear();

replServer.defineCommand('cls', {
  action: clear,
  help: 'Clears the screen.'
});
replServer.defineCommand('clear', {
  action: clear,
  help: 'Clears the screen.'
});
replServer.defineCommand('about', {
  action: about,
  help: 'Shows info about this project.'
});
replServer.defineCommand('state', {
  help: 'Shows stats about this REPL\'s state.',
  action() {
    const state = generateState();
    const i = (s) => `\x1b[3m${s}\x1b[23m`;
    const j = ', ';

    state.classes = [...Object.keys(state.classes)].map(k => String(k));
    state.functions = [...Object.keys(state.functions)].map(k => String(k));
    state.properties = [...Object.keys(state.properties)].map(k => String(k));
    state.descriptors.accessors = [...Object.keys(state.descriptors.accessors)].map(k => String(k));
    state.descriptors.data = [...Object.keys(state.descriptors.data)].map(k => String(k));

    console.log(`\x1b[1mClasses\x1b[22m\n${wrapContent(state.classes, i, j)}`);
    console.log(`\x1b[1mFunctions\x1b[22m\n${wrapContent(state.functions, i, j)}`);
    console.log(`\x1b[1mProperties\x1b[22m\n${wrapContent(state.properties, i, j)}`);
    console.log(`\x1b[1mAccessor Descriptors\x1b[22m\n${wrapContent(state.descriptors.accessors, i, j)}`);
    console.log(`\x1b[1mData Descriptors\x1b[22m\n${wrapContent(state.descriptors.data, i, j)}`);

    replServer.displayPrompt();
  }
});

overridableGlobal('clear', clear);
overridableGlobal('cls', clear);
overridableGlobal('state', generateState);

Object.defineProperty(replServer, '_initialPrompt', {
  get() {
    const isRed = !globalThis?._;
    const prompt = isRed
      ? '\x1b[31mλ\x1b[1;39m\x1b[22m '
      : '\x1b[32mλ\x1b[1;39m\x1b[22m ';

    return prompt;
  }
});

function overridableGlobal(
  property,
  action,
  changeText = 'Expression assignment to "@X", previous function now disabled.'
) {
  const message = changeText.replaceAll(/\@X/g, property);
  let changed = false;
  let storage = undefined;

  const makeDescriptor = () => ({
    get() {
      if (changed === false) {
        return action();
      }
      return storage;
    },
    set(value) {
      if (changed === false) {
        console.log(message);
        changed = true;
      }
      storage = value;
    },
    configurable: true,
    get enumerable() { return changed }
  });

  replServer.defineCommand(
    `restore${property.charAt(0).toUpperCase()}${property.substring(1,property.length)}`,
    {
      action() {
        changed = false;
        storage = undefined;
        Object.defineProperty(globalThis, property, makeDescriptor());
        console.log(this.help);
      },
      help: `Restores ${property} to default REPL custom state.`,
    }
  );

  Object.defineProperty(globalThis, property, makeDescriptor());
}

/**
 * Generates a snapshot of the current REPL state, categorizing global objects
 * into classes, functions, properties, symbols, and descriptors. This function
 * is designed to capture and organize the current state for inspection or
 * modification purposes. It temporarily disables invocation to safely enumerate
 * global objects, capturing their descriptors and categorizing them accordingly.
 * If invocation is already disabled, it returns the current state without
 * modification. Skipped properties during enumeration are tracked but not
 * processed further.
 *
 * @returns {Object} An object representing the current REPL state, with
 * properties for classes, functions, properties, symbols, and descriptors
 * (further divided into accessors and data descriptors). Each category is an
 * object with keys as the global identifiers and values containing the key,
 * value, and descriptor of the item.
 */
function generateState() {
  const replState = {
    classes: {},
    functions: {},
    properties: {},
    symbols: {},
    descriptors: {
      accessors: {},
      data: {},
    },
  };

  if (!allowInvocation) {
    return replState;
  }

  let skipped = [];

  allowInvocation = false;
  Reflect.ownKeys(globalThis).forEach(key => {
    try {
      const value = globalThis[key];
      const descriptor = Object.getOwnPropertyDescriptor(globalThis, key);

      if (String(value).startsWith('class')) {
        replState.classes[key] = {key, value, descriptor};
      }
      else if (typeof value === 'function') {
        replState.functions[key] = {key, value, descriptor};
      }
      else {
        replState.properties[key] = {key, value, descriptor};
      }

      if (typeof key === 'symbol') {
        replState.symbols[key] = { key, value, descriptor };
      }

      if (Reflect.has(descriptor, 'get') || Reflect.has(descriptor, 'set')) {
        replState.descriptors.accessors[key] = { key, descriptor };
      }
      else if (Reflect.has(descriptor, 'value')) {
        replState.descriptors.data[key] = { key, descriptor };
      }
    }
    catch (ignored) {
      skipped.push(String(key));
    }
  });
  allowInvocation = true;

  return replState;
}

/**
 * Formats a string or array of values into lines with specified indentation and line width.
 * @param {string|array} input - The input string or array of strings to be formatted.
 * @param {number} nCols - The maximum number of columns per line (default 80).
 * @param {number} nSpaceIndents - The number of spaces for indentation (default 2).
 * @returns {string} The formatted string.
 */
function formatValues(input, transform, nCols = 80, nSpaceIndents = 2) {
  // Split the string into an array if input is a string
  const values = typeof input === 'string' ? input.split(', ') : input;
  let line = ''.padStart(nSpaceIndents, ' ');
  let result = [];

  values.forEach((value, index) => {
    // Transform value if a transform function is supplied.
    if (transform && typeof transform === 'function') {
      value = transform(value);
    }

    // Check if adding the next value exceeds the column limit
    if (line.length + value.length + 2 > nCols && line.trim().length > 0) {
      // If it does, push the line to the result and start a new line
      result.push(line);
      line = ''.padStart(nSpaceIndents, ' ');
    }

    // Add the value to the line, followed by ", " if it's not the last value
    line += value + (index < values.length - 1 ? ', ' : '');
  });

  // Add the last line if it's not empty
  if (line.trim().length > 0) {
    result.push(line);
  }

  return result.join('\n');
}

function wrapContent(longString, transform, joinOn = ' ', indent = 2, wrapAt = 80) {
  let asArray = Array.isArray(longString)
    ? longString
    : String(longString).replaceAll(/\r\n/g, '\n').split('\n');

  asArray = asArray.map(element => String(element).trim());

  let lines = [];
  let maxLen = wrapAt - indent;
  let curLine = [];
  let sgrLength = (s) => s.replaceAll(/\x1b\[?\d+(;\d+)*[a-zA-Z]/g, '').length;

  for (let element of asArray) {
    if (typeof transform === 'function') {
      element = String(transform(element)).trim();
    }

    let curLength = sgrLength(curLine.join(joinOn));
    let elementLength = sgrLength(String(element) + joinOn);

    if (curLength + elementLength > maxLen) {
      let leading = indent > 0 ? ' '.repeat(indent) : '';
      lines.push(`${leading}${curLine.join(joinOn)}`);
      curLine = [];
    }

    curLine.push(String(element));
  }

  return lines.join('\n');
}