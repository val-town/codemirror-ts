# codemirror-ts

_[Made by val.town](https://www.val.town/), a social website to write and deploy backend services._

On npm as `@valtown/codemirror-ts`

- [Demo on StackBlitz](https://stackblitz.com/edit/vitejs-vite-giwkc3?file=index.html)
- [Demo on StackBlitz using Web Workers](https://stackblitz.com/edit/vitejs-vite-qsncw4?file=src%2Fmain.ts)

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

## Setup

Below are recipes for setting up this code - check out the StackBlitz
demos above if you want easily copy-paste-able code!

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

2. Install the facet and the sync extension:

The facet configures the rest of the extensions
with the right path and environment.

When you make changes in your
editor, the sync extension mirrors them to the TypeScript environment using
`createFile` and `updateFile` in the TypeScript compiler.

_Note, also, that we're supplying a path._ These extensions
use file paths in order to differentiate between different editor
instances and to allow editors to import & export to & from
one another. So each extension has a required `path` parameter,
as well as the `env` parameter which should be your TypeScript
environment.

```ts
import { tsSync, tsFacet } from "@valtown/codemirror-ts";

let path = "index.ts";

let editor = new EditorView({
  extensions: [
    basicSetup,
    javascript({
      typescript: true,
      jsx: true,
    }),
    tsFacet.of({ env, path }),
    tsSync(),
  ],
  parent: document.querySelector("#editor"),
});
```

### Linting

The `tsLinter` extension can be initialized
like this and added to the `extensions` array in the setup
of your CodeMirror instance.

```ts
tsLinter();
```

This uses the [@codemirror/lint](https://codemirror.net/docs/ref/#lint)
package and grabs diagnostics from the TypeScript environment.

_If you want to modify how lints are handled, you can use
the `getLints({ env, path })` method and wire it up with
CodeMirror's linter method yourself._

### Autocompletion

To make it possible to combine different autocompletion
sources, we expose a [`CompletionSource`](https://codemirror.net/docs/ref/#autocomplete.autocompletion) which you can use with the CodeMirror `autocomplete` method:

```ts
autocompletion({
  override: [tsAutocomplete()],
});
```

_We expose a lower-level interface to autocompletions with the
`getAutocompletion({ env, path, context })` method that takes
a `CompletionContext` parameter._

### Hover

The hover definition can be used like the following:

```ts
tsHover();
```

Which automatically uses a default renderer. However, you can
customize this to your heart's content, and use your web framework
to render custom UI if you want to, using the `renderTooltip` option.

```ts
tsHover({
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

The third option in `createDefaultMapFromCDN` is whether to cache files: it uses `localStorage` to power
that cache, and Web Workers don't support `localStorage`. You can [implement](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/typescript-vfs/src/index.ts#L368) your own `storer` instead.

There is an optional fifth option in `createDefaultMapFromCDN` to pass in `lzstring` to compress files that as well. You can follow [this example](https://github.com/microsoft/TypeScript-Website/blob/v2/packages/sandbox/src/index.ts#L8) and add a `lzstring.min.js` file to your codebase if you want.

2. Initialize the worker

Now, on the application side (in the code in which you're initializing CodeMirror),
you'll need to import and initialize the worker:

```ts
import { type WorkerShape } from "@valtown/codemirror-ts/worker";
import * as Comlink from "comlink";

const innerWorker = new Worker(new URL("./worker.ts", import.meta.url), {
  type: "module",
});
const worker = Comlink.wrap<WorkerShape>(innerWorker);
await worker.initialize();
```

3. Add extensions

In short, there are `*`Worker versions of each of the extension
that accept the `worker` instead of `env` as an argument.

```ts
[
  tsFacetWorker.of({ worker, path }),
  tsSyncWorker(),
  tsLinterWorker(),
  autocompletion({
    override: [tsAutocompleteWorker()],
  }),
  tsHoverWorker(),
];
```

## Conceptual notes: persisted code

There are a few different approaches to building CodeMirror + TypeScript
integrations. Each of the things that this does - linting, hovering,
autocompleting - they all require TypeScript to know about your source
code. It's tempting to send it over all the time: you get your whole
source code and call something like

```ts
lint(sourceCode);
```

However, this has an overhead, and it combines poorly: if you're linting,
and hovering, and autocompleting, it's inefficient to send the whole code
over for each of those. Hence how these extensions start with the _sync_
method, which updates TypeScript's version of the code contents.

This has some drawbacks: maybe the version gets out of sync, especially
when the TypeScript environment is in a worker. But we think it's worth
it, and it yields some other benefits.

## Conceptual notes: file names

These extensions expect your client-side CodeMirror instance to be attached
to a filename, like `index.ts`. By sharing a TypeScript environment,
this lets you have two CodeMirror instances, say, editing `a.ts` and `b.ts`,
and for one to import values from the other and get the correct types -
because TypeScript automatically include both.

Note, however: these extensions currently _only support creating and updating files_ - if you support removing or deleting files, they won't be possible to do that. It would be really nice to support those other parts of the lifecycle - PRs gladly accepted!

## Conceptual notes: Comlink

This uses [Comlink](https://github.com/GoogleChromeLabs/comlink) as an
abstraction for the WebWorker. There are certainly other ways to build it -
we could write our own similar abstraction. But, Comlink is a pretty nifty
way to use Web Workers - it allows you to call functions in a web worker
from the top page.

Like any other communication across `postMessage`, there are limits
on the kinds of values you can pass. So we can't pass the raw `CompletionContext` object
across the boundary. Right now this module works around that limitation
by just passing the properties we need. There may be other solutions
in the future.

Comlink is [lightweight](https://bundlephobia.com/package/comlink@4.4.1) (4.7kb gzipped).

### ❤️ Other great CodeMirror plugins

- [codemirror-vim](https://github.com/replit/codemirror-vim)
- [codemirror-copilot](https://github.com/asadm/codemirror-copilot)
