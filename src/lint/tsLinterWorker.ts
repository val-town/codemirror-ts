import { linter, Diagnostic } from "@codemirror/lint";
import { type WorkerShape } from "../worker.js";

export function tsLinterWorker({
  worker,
  path,
}: {
  worker: WorkerShape;
  path: string;
}) {
  return linter(async (_view): Promise<readonly Diagnostic[]> => {
    return worker.getLints({ path });
  });
}
