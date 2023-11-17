# codemirror-ts

On npm as `@valtown/codemirror-ts`

- [Demo on StackBlitz](https://stackblitz.com/edit/vitejs-vite-giwkc3?file=index.html)

TypeScript extensions for CodeMirror. This aims to support
as much of the basic interactions with TypeScript code as possible
in CodeMirror.

## Currently provides

- Hover hints for types
- Autocomplete
- Diagnostics (lints, in CodeMirror's terminology)

## Peer dependencies

This module does not depend on anything: your project should
have direct dependencies to:

- `@codemirror/view`
- `@codemirror/lint`
- `@codemirror/autocomplete`

## Setup (main thread)

This is the simplest way to use this code: you'll be running
the TypeScript server on the same processing as the rest of the web
application. To run the TypeScript server in a worker (which can yield
performance benefits, at the cost of complexity), see the next
section.

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

## Linting

The `tsLinter` extension can be initialized
like this and added to the `extensions` array in the setup
of your CodeMirror instance.

```ts
tsLinter({ env, path });
```

This uses the [@codemirror/lint](https://codemirror.net/docs/ref/#lint)
package and grabs diagnostics from the TypeScript environment.

_If you want to modify how lints are handled, you can use
the `getLints({ env, path })` method and wire it up with
CodeMirror's linter method yourself._

## Autocompletion

To make it possible to combine different autocompletion
sources, we expose a [`CompletionSource`]((https://codemirror.net/docs/ref/#autocomplete.autocompletion) which you can use with the CodeMirror `autocomplete` method:

```ts
autocompletion({
  override: [tsAutocomplete({ env, path })],
});
```

_We expose a lower-level interface to autocompletions with the
`getAutocompletion({ env, path, context })` method that takes
a `CompletionContext` parameter._

## Hover

The hover definition can be used like the following:

```ts
tsHover({
  env,
  path,
});
```

Which automatically uses a default renderer. However, you can
customize this to your heart's content, and use your web framework
to render custom UI if you want to, using the `renderTooltip` option.

```ts
tsHover({
  env,
  path,
  renderTooltip: (info: HoverInfo) => {
    const div = document.createElement("div");
    if (info.quickInfo?.displayParts) {
      for (let part of info.quickInfo.displayParts) {
        const span = div.appendChild(document.createElement("span"));
        span.className = `quick-info-${part.kind}`;
        span.innerText = part.text;
      }
    }
    return { dom: div };
  },
});
```

## Setup (worker)

Using a [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Worker), you can
run TypeScript separately from the rest of your JavaScript, which can make
both faster and more reliable. Depending on how you're building applications,
you'll need to consult their documentation on setting up web workers:

- [Using workers with Vite](https://vitejs.dev/guide/features#web-workers)
- With Next.js, you'll need to make sure that you're [using Webpack 5](https://nextjs.org/docs/messages/webpack5)
- With Remix, you'll need [a separate entry point](https://github.com/remix-run/remix/discussions/4416?sort=new) (or it may work automatically if you've switched to using Vite with Remix)

With that out of the way:

1. Create your worker

In a file like `worker.ts`, you'll need something like this:

```ts
import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from "@typescript/vfs";
import ts from "typescript";
import * as Comlink from "comlink";
import { createWorker } from "@valtown/codemirror-ts/worker";

Comlink.expose(
  createWorker(async function () {
    const fsMap = await createDefaultMapFromCDN(
      { target: ts.ScriptTarget.ES2022 },
      "3.7.3",
      false,
      ts,
    );
    const system = createSystem(fsMap);
    const compilerOpts = {};
    return createVirtualTypeScriptEnvironment(system, [], ts, compilerOpts);
  }),
);
```

This code should look familiar if you read the section about setting this up
with the main thread: it's the same setting-up of the TypeScript environment,
but this time wrapping it in `Comlink.expose`, and, importantly, setting
the third parameter of `createDefaultMapFromCDN` to false.

The third option is whether to cache files: it uses `localStorage` to power
that cache, and Web Workers don't support `localStorage`.

2. Initialize the worker

Now, on the application side (in the code in which you're initializing CodeMirror),
you'll need to import and initialize the worker:

```ts
import { WorkerShape } from "@valtown/codemirror-ts/worker";
import * as Comlink from "comlink";

const innerWorker = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
});
const worker = Comlink.wrap(innerWorker) as WorkerShape;
await worker.initialize();
```

3. Add extensions

In short, there are `*`Worker versions of each of the extension
that accept the `worker` instead of `env` as an argument.

```ts
[
  tsSyncWorker({ worker, path }),
  tsLinterWorker({ worker, path }),
  autocompletion({
    override: [tsAutocompleteWorker({ worker, path })],
  }),
  tsHoverWorker({
    worker,
    path,
  }),
];
```
