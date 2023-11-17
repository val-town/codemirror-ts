import { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { EditorView } from "@codemirror/view";

/**
 * Sync updates from CodeMirror to the TypeScript
 * virtual environment. Note that this updates a file - it isn't
 * responsible (yet) for deleting or renaming files if they
 * do get deleted or renamed.
 */
export function tsSync({
  env,
  path,
}: {
  env: VirtualTypeScriptEnvironment;
  path: string;
}) {
  // TODO: this is a weak solution to the cold start problem.
  // If you boot up a CodeMirror instance, we want the initial
  // value to get loaded into CodeMirror. We do get a change event,
  // but it surprisingly doesn't have `docChanged: true` on it,
  // so this is a rough heuristic to just accept the first event
  // regardless of whether it looks significant.
  let first = true;
  return EditorView.updateListener.of((update) => {
    if (!update.docChanged && !first) return;
    first = false;

    // In TypeScript, updates are not like PUTs, you
    // need to create a file before updating it.
    if (!env.getSourceFile(path)) {
      env.createFile(path, update.state.doc.toString());
    } else {
      env.updateFile(path, update.state.doc.toString());
    }
  });
}
