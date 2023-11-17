import { VirtualTypeScriptEnvironment } from "@typescript/vfs";
import { EditorView } from "@codemirror/view";

export function tsSync({
  env,
  path,
}: {
  env: VirtualTypeScriptEnvironment;
  path: string;
}) {
  return EditorView.updateListener.of((update) => {
    if (!update.docChanged) return;

    // In TypeScript, updates are not like PUTs, you
    // need to create a file before updating it.
    if (!env.getSourceFile(path)) {
      env.createFile(path, update.state.doc.toString());
    } else {
      env.updateFile(path, update.state.doc.toString());
    }
  });
}
