import { linter } from "@codemirror/lint";
export function tsLinterWorker({ worker, path, }) {
    return linter(async (_view) => {
        return worker.getLints({ path });
    });
}
//# sourceMappingURL=tsLinterWorker.js.map