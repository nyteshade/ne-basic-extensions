const ts = await import('typescript')

export function findFunction(node) {
  const types = new Map([
    ['ArrowFunction', ts.SyntaxKind.ArrowFunction],
    ['FunctionDeclaration', ts.SyntaxKind.FunctionDeclaration],
  ])

  for (const child of node.getChildren()) {
    if ([...types.values()].includes(child.kind)) {
      return child
    }
    else if (child.getChildren().length) {
      let result = findFunction(child)
      if (result)
        return result
    }
  }

  return undefined
}

export function makeSourceFile(sourcecode) {
  return ts.createSourceFile('t.js', sourcecode, ts.ScriptTarget.Latest, true)
}

export function extractSignature(fn) {
  if (!fn || typeof fn !== 'function')
    return `Unable to extract signature from ${fn?.name}`

  const isAsync = !!(/object Async/.exec(Object.prototype.toString.call(fn)))
  const isBigArrow = Reflect.has(fn, 'prototype')
  let sourcecode = fn.toString()

  if (!isBigArrow) {
    const starters = ['function', 'async function']
    if (!starters.some(sw => fn.toString().startsWith(sw))) {

    }
  }

  const source = makeSourceFile(sourcecode)
  const declaration = findFunction(source)

  if (!declaration || !declaration.parameters)
    return `Unable to extract signature from ${fn?.name}`


  const signature = [
    isAsync ? 'async ' : '',
    isBigArrow ? '(' : 'function (',
    declaration.parameters.map(parameter => parameter.getText()).join(', '),
    ')',
  ].join('')

  return signature
}

Object.defineProperty(Function.prototype, 'signature', {
  get() { return extractSignature(this) },
  configurable: true,
  enumerable: false,
})