import { linter } from "@codemirror/lint";
import { getLints } from "./getLints.js";
export function tsLinter({ env, path, }) {
    return linter(async (view) => {
        return getLints({
            env,
            path,
        });
    });
}
//# sourceMappingURL=tsLinter.js.map