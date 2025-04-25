#!/usr/bin/env node --no-warnings --no-deprecations --enable-source-maps

// Import everything for playtesting.
(await import('./dist/mjs/index.js')).Controls.enableAll();
(await import('./bin/repl.signature.js'))

// Grab typescript
const ts = await import('typescript')

const {
  accessor, data, describe, describeMany, extract, isDescriptor,
  isAccessor, isData, redescribe,
} = await import('./dist/mjs/utils/index.js')

const { inspect } = await import('util');
const nejsExtension = await import('@nejs/extension');

const repl = await import('node:repl');
const fs = await import('node:fs');

const { createRepl } = await import('./bin/repl.basics.js')

let replServer = undefined
const help = () =>
`
Welcome to the @nejs/basic-extensions repl bootstrapping process, the
following objects are in scope for you to use. Additionally, all the
extensions and patches included in basic-extensions are enabled and
ready for testing.

${replServer ? replServer.generateStateString() : `
Use the command \x1b[1mstate\x1b[22m to see all variables
exposed to the REPL for testing.
`}
Additionally
  .help           - See REPL dot commands
  info            - Show this menu again
  state           - See the exposed REPL variables again
`

replServer = createRepl({
  commands: [
    ['info', {
      action() {
        console.log(help());
        this?.displayPrompt()
      },
      help: 'Shows info about defined properties'
    }]
  ],
  exports: {
    Patch: nejsExtension.Patch,
    Extension: nejsExtension.Extension,

    accessor, data, describe, describeMany, extract, inspect,
    isAccessor, isData, isDescriptor, redescribe, ts,
  },
  onReady() {
    console.log(help())
  }
})
