# Plan: Simplify Build to ESM-First for `@nejs/extension` (`nyteshade/ne-extension`)

## Task

Simplify the build system for `@nejs/extension` to be **ESM-first**, matching the pattern already applied to `@nejs/basic-extensions`. The goal is:

1. **Ship `src/` directly as ESM** — no compiled `dist/mjs/` directory
2. **Use `tsc` only for `.d.ts` generation** (`emitDeclarationOnly`) into `dist/types/`
3. **Use `esbuild` for CJS bundles** (one per entry point) and the browser IIFE bundle
4. **Delete redundant build artifacts** — remove the entire `dist/mjs/` directory and per-file CJS outputs
5. **Convert tests** from CJS `require('../dist/cjs/...')` to ESM `import ... from '../src/...'`
6. **Update README** to document the new ESM-first layout

## Step-by-step instructions

### 1. Consolidate tsconfig files

- **Delete** `tsconfig.cjs.json` and `tsconfig.esm.json` (if they exist)
- **Rename** `tsconfig.base.json` → `tsconfig.json` (if that's the current layout; if `tsconfig.json` already exists, merge into it)
- Set the following in `tsconfig.json` `compilerOptions`:

```json
{
  "allowJs": true,
  "allowSyntheticDefaultImports": true,
  "baseUrl": "./src",
  "declaration": true,
  "emitDeclarationOnly": true,
  "declarationDir": "dist/types",
  "esModuleInterop": true,
  "lib": ["esnext"],
  "module": "ESNext",
  "moduleResolution": "node",
  "noFallthroughCasesInSwitch": false,
  "pretty": true,
  "resolveJsonModule": true,
  "rootDir": "./src",
  "skipLibCheck": true,
  "strict": true,
  "target": "ESNext",
  "types": ["vitest"]
}
```

- Remove these if present: `inlineSourceMap`, `listEmittedFiles`, `listFiles`, `sourceMap`, `traceResolution`
- Keep `"include": ["src/**/*.js"]` (or `"src/**/*.ts"` if it's a TS project), `"exclude": ["node_modules", "dist"]`

### 2. Rewrite `bin/build`

Replace the shell script with a Node ESM script:

```js
#!/usr/bin/env node

import { existsSync, mkdirSync } from 'fs'
import { execSync } from 'child_process'

function inRoot() {
  return existsSync('tsconfig.json') &&
    existsSync('bin') &&
    existsSync('src')
}

if (!inRoot()) {
  console.error('Please move to the root of the package')
  console.error(`You are currently in ${process.cwd()}`)
  process.exit(1)
}

// Make dist if missing
if (!existsSync('dist')) {
  mkdirSync('dist')
}

// Generate type declarations only
execSync('npx tsc', { stdio: 'inherit' })
```

### 3. Rewrite `bin/esbuild`

Add CJS bundling alongside the existing browser IIFE bundle. Look at the repo's `package.json` `exports` field to determine what CJS entry points are needed. The pattern is:

```js
// After the existing IIFE browser bundle build, add:

// Collect external dependencies (don't bundle them into CJS output)
const external = [
  ...Object.keys(packageJSON.dependencies || {}),
  ...Object.keys(packageJSON.peerDependencies || {}),
]

// CJS builds for each entry point (adjust paths based on this repo's exports)
const cjsEntryPoints = [
  { entry: `src/index${ext}`, outfile: 'dist/cjs/index.cjs' },
  // Add one per sub-export path, e.g.:
  // { entry: `src/classes/index${ext}`, outfile: 'dist/cjs/classes/index.cjs' },
]

await Promise.all(cjsEntryPoints.map(({ entry, outfile }) =>
  esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: 'cjs',
    platform: 'node',
    target: ['node20'],
    sourcemap: true,
    outfile,
    external,
  })
)).catch((e) => {
  console.error(e)
  process.exit(1)
})
```

### 4. Delete `bin/fixup` (if it exists)

It created `dist/cjs/package.json` and `dist/mjs/package.json` — no longer needed.

### 5. Delete `dist/mjs/` entirely

Remove the entire compiled ESM output directory. It's replaced by `src/` directly.

### 6. Delete per-file CJS outputs in `dist/cjs/`

Remove individual `.js` and `.js.map` files from `dist/cjs/`. They're replaced by bundled `.cjs` files from esbuild. Keep only the new `.cjs` and `.cjs.map` files that esbuild generates. Also remove `dist/cjs/package.json` if present.

### 7. Move `.d.ts` files to `dist/types/`

If `.d.ts` files currently live in `dist/cjs/` or `dist/mjs/`, they'll now be generated into `dist/types/` by the new tsconfig. Delete the old copies.

### 8. Update `package.json`

- `"type": "module"` (should already be set)
- `"main": "dist/cjs/index.cjs"` (point to the new CJS bundle)
- `"module": "src/index.js"` (point ESM to source directly)
- `"types": "dist/types/index.d.ts"`
- Update `"exports"` — for each entry point:

```json
".": {
  "types": "./dist/types/index.d.ts",
  "import": "./src/index.js",
  "require": "./dist/cjs/index.cjs"
}
```

- Update `"scripts"`:
  - `"build"` should run: `bin/clean && bin/version patch bump && bin/build && bin/esbuild`
  - `"distribute"` should run: `bin/clean && bin/version minor bump && bin/build && bin/esbuild`
  - Ensure `bin/build` runs before `bin/esbuild` (types first, then bundles)

### 9. Convert all test files from CJS to ESM

Search all files in `tests/` for `require(` patterns. Convert them like this:

**Before:**
```js
const { Patches } = require('../dist/cjs/index.js')
const SomeExtension = Patches.get(Something.prototype)

import { describe, expect, it } from 'vitest';
```

**After:**
```js
import { describe, expect, it } from 'vitest';
import { Patches } from '../src/index.js'

const SomeExtension = Patches.get(Something.prototype)
```

Key rules:
- Move `import` statements to the top (ESM requires this)
- Change `require('../dist/cjs/...')` → `import ... from '../src/...'`
- Keep the rest of each test file unchanged

### 10. Verify

- Run `npx tsc` — should generate `.d.ts` files in `dist/types/`
- Run `node bin/esbuild` — should generate CJS bundles in `dist/cjs/` and browser bundle in `dist/`
- Run `npx vitest run` — all tests should pass
- Verify ESM import: `node -e "import('./src/index.js').then(m => console.log(Object.keys(m)))"`

### 11. Update README

Document the new build layout:
- ESM: import directly from `src/` (no build step needed)
- CJS: `dist/cjs/*.cjs` (bundled by esbuild)
- Browser: `dist/@nejs/extension.bundle.X.Y.Z.js` (IIFE)
- Types: `dist/types/` (generated by tsc)

## Reference

This exact pattern was successfully applied to `@nejs/basic-extensions` in commits `f60f15c` and `c7c79e4`. The result removed ~44k lines of redundant compiled output and all 189 tests pass.
