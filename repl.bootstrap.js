#!/usr/bin/env node --no-warnings --no-deprecations --enable-source-maps

// Import everything for playtesting.
(await import('./dist/mjs/index.js')).Controls.enableAll();

const { accessor, data, isDescriptor } = await import('./dist/mjs/utils/index.js')
const { inspect } = await import('util');

const nejsExtension = await import('@nejs/extension');

const repl = await import('node:repl');
const fs = await import('node:fs');
const { createRepl } = await import('./bin/repl.basics.js')

const help =
`
Welcome to the @nejs/basic-extensions repl bootstrapping process, the
following objects are in scope for you to use. Additionally, all the
extensions and patches included in basic-extensions are enabled and
ready for testing.

  Patch        - the Patch class from @nejs/extension
  Extension    - the Extension class from @nejs/extension
  inspect      - node.js util.inspect() function

  accessor     - the descriptor utils accessor() function
  data         - the descriptor utils data() function
  isDescriptor - the descriptor utils isDescriptor() function

  .help           - See REPL dot commands
  info            - Show this menu again
`

createRepl({
  commands: [
    ['info', {
      action() {
        console.log(help);
        this?.displayPrompt()
      },
      help: 'Shows info about defined properties'
    }]
  ],
  exports: {
    Patch: nejsExtension.Patch,
    Extension: nejsExtension.Extension,
    inspect,
    accessor, data, isDescriptor,
  },
  onReady() {
    console.log(help)
  }
})
