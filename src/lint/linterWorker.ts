import { linter, Diagnostic } from "@codemirror/lint";
import * as Comlink from "comlink";

export function tsLinterWorker({
  worker,
  path,
}: {
  worker: Comlink.Remote<{
    getLints: ({ path }: { path: string }) => Diagnostic[];
  }>;
  path: string;
}) {
  return linter(async (_view): Promise<readonly Diagnostic[]> => {
    return worker.getLints({ path });
  });
}
