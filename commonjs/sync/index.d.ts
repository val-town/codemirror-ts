import { VirtualTypeScriptEnvironment } from "@typescript/vfs";
/**
 * Sync updates from CodeMirror to the TypeScript
 * virtual environment. Note that this updates a file - it isn't
 * responsible (yet) for deleting or renaming files if they
 * do get deleted or renamed.
 */
export declare function tsSync({ env, path, }: {
    env: VirtualTypeScriptEnvironment;
    path: string;
}): import("@codemirror/state").Extension;
//# sourceMappingURL=index.d.ts.map