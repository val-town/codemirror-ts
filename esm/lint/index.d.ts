import { Diagnostic } from "@codemirror/lint";
import { VirtualTypeScriptEnvironment } from "@typescript/vfs";
export declare function getLints({ env, path, }: {
    env: VirtualTypeScriptEnvironment;
    path: string;
}): Diagnostic[];
export declare function tsLinter({ env, path, }: {
    env: VirtualTypeScriptEnvironment;
    path: string;
}): import("@codemirror/state").Extension;
//# sourceMappingURL=index.d.ts.map