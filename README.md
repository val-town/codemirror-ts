# codemirror-ts


<a href="https://www.npmjs.com/package/@valtown/codemirror-ts" rel="nofollow"><img src="https://img.shields.io/npm/dw/@valtown/codemirror-ts.svg" alt="npm"></a>

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
- Go-to definition

## Peer dependencies

This module does not depend on anything: your project should
have direct dependencies to:

- `@codemirror/view`
- `@codemirror/lint`
- `@codemirror/autocomplete`

## Setup

Below are recipes for setting up this code - check out the StackBlitz
demos above if you want easily copy-paste-able code!

## Setup

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
  tsGotoWorker(),
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

## Conceptual notes: LSP

This module uses TypeScript’s public APIs to power its functionality:
it _doesn't_ use the [Language Server Protocol](https://en.wikipedia.org/wiki/Language_Server_Protocol), which is
a specification developed by Microsoft and intended for functionality like
this. [TypeScript itself does not have a first-party LSP implementation](https://github.com/microsoft/TypeScript/issues/39459)
and LSP is usually used across a network. Most good TypeScript language
tooling, like VS Code’s autocompletion, does not use the LSP specification.
Unfortunately, most TypeScript language tooling in other editors is based directly
off of the VS Code implementation.

### ❤️ Other great CodeMirror plugins

- [codemirror-vim](https://github.com/replit/codemirror-vim)
- [codemirror-copilot](https://github.com/asadm/codemirror-copilot)
