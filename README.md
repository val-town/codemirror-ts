# codemirror-ts

TypeScript extensions for CodeMirror. This aims to support
as much of the basic interactions with TypeScript code as possible
in CodeMirror.

## Roadmap

Proof of concepts:

- [ ] Hover hints for types
- [ ] Autocomplete
- [ ] Diagnostics

## Options

There are multiple ways to create these extensions. For example,
what kind of TypeScript language server are you going to use?

- Client-side using [@typescript/vfs](https://www.npmjs.com/package/@typescript/vfs), on the main frame, or in a web worker.
- On the server using the LSP protocol.

Similarly, how do you want to render UI? CodeMirror has its own way,
as does React and Vue and other frameworks. Regardless of their
strengths and weaknesses, the most common answer is that applications
want to render UI with the system that they're already using. This
module attempts to make that possible.
