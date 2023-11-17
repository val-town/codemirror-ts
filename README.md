# codemirror-ts

TypeScript extensions for CodeMirror. This aims to support
as much of the basic interactions with TypeScript code as possible
in CodeMirror.

## Currently provides

- Hover hints for types
- Autocomplete
- Diagnostics

## Using these extensions

_This is designed to scale up to more complex scenarios, so there
is some assembly required. We could encapsulate more, but that would
mean removing important points of control._

1. Create a TypeScript environment.

We don't create a TypeScript environment for you. This you bring, and it probably
is used for other parts of your application. The simplest setup would be something like this,
using [@typescript/vfs](https://www.npmjs.com/package/@typescript/vfs):

```ts
import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";

const fsMap = await createDefaultMapFromCDN(
  { target: ts.ScriptTarget.ES2022 },
  "3.7.3",
  true,
  ts,
);
const system = createSystem(fsMap);
const compilerOpts = {};
const env = createVirtualTypeScriptEnvironment(system, [], ts, compilerOpts);
```

2. Install the sync extension:

This extension powers the rest: when you make changes in your
editor, this mirrors them to the TypeScript environment using
`createFile` and `updateFile` in the TypeScript compiler.

_Note, also, that we're supplying a path._ These extensions
use file paths in order to differentiate between different editor
instances and to allow editors to import & export to & from
one another. So each extension has a required `path` parameter,
as well as the `env` parameter which should be your TypeScript
environment.

```ts
import { tsSync } from "@valtown/codemirror-ts";

let env = "index.ts";

let editor = new EditorView({
  extensions: [
    basicSetup,
    javascript({
      typescript: true,
      jsx: true,
    }),
    tsSync({ env, path }),
  ],
  parent: document.querySelector("#editor"),
});
```

## Roadmap

- [ ] Support for a TypeScript environment in a WebWorker

## Framework-agnostic

This module aims to be frontend framework-agnostic. For whatever needs
to be rendered, you can provide your own render method, which can use
React, Vue, or any other library that can produce a finished DOM element.
